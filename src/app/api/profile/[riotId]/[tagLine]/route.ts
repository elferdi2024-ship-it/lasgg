import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RiotService } from '@/lib/riot-service';
import { calculateLens } from '@/lib/lens-calculator';
import { TagEngine, PlayerStats, Benchmark } from '@/lib/tag-engine';
import rateLimit from '@/lib/rate-limit';
import { z } from 'zod';

// Rate Limiter: 10 requests per minute per IP (Heavy endpoint)
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Zod Schema
const ProfileParamsSchema = z.object({
    riotId: z.string().min(1),
    tagLine: z.string().min(1),
});

// --- BENCHMARKS ---
const BENCHMARKS: Record<keyof PlayerStats, Benchmark> = {
    dpm: { avg: 550, stdDev: 150 },
    kda: { avg: 2.5, stdDev: 1.0 },
    visionScore: { avg: 1.0, stdDev: 0.4 },
    csMin: { avg: 6.5, stdDev: 1.5 },
    turretDmg: { avg: 2500, stdDev: 1200 },
    kp: { avg: 0.5, stdDev: 0.15 },
    soloKills: { avg: 2.0, stdDev: 1.5 },
    deaths: { avg: 5.0, stdDev: 2.0 }
};

// Mapa de Tag a Servidor de Riot
const REGION_MAP: Record<string, string> = {
    'LAS': 'la2',
    'LAN': 'la1',
    'BR1': 'br1',
    'BR': 'br1',
    'NA1': 'na1',
    'NA': 'na1',
    'EUW1': 'euw1',
    'EUW': 'euw1',
    'EUNE1': 'eune1',
    'EUNE': 'eune1',
    'KR1': 'kr',
    'KR': 'kr',
    'JP1': 'jp1',
    'JP': 'jp1',
    'SAINT': 'la2', // Parche para tag Saint
    'URU': 'la2' // Caso especial para tu tag
};

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ riotId: string; tagLine: string }> }
) {
    try {
        // 1. Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        try {
            await limiter.check(10, ip);
        } catch {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        const params = await props.params; // Next.js 15+ await params

        // 2. Input Validation
        const validation = ProfileParamsSchema.safeParse(params);
        if (!validation.success) {
            return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
        }

        const riotId = decodeURIComponent(validation.data.riotId);
        const tagLine = decodeURIComponent(validation.data.tagLine);

        if (riotId === 'undefined') {
            return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
        }

        console.log(`🚀 API: Analizando a ${riotId} #${tagLine}`);

        // 3. INICIALIZAR SERVICIO (Local por request para evitar colisiones regionales)
        const riotService = new RiotService(process.env.RIOT_API_KEY || '');

        // 2. RIOT API: Obtener Cuenta (PUUID) - Usamos americas por defecto (Account-V1 es continental)
        const account = await riotService.getAccount(riotId, tagLine);
        if (!account) {
            console.error(`❌ Usuario no encontrado: ${riotId}#${tagLine}`);
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // 3. DETECTAR REGIÓN TÁCTICA PARA RANGO (Mejorado)
        let targetRegion = REGION_MAP[tagLine.toUpperCase()] || 'la2';

        // Si el tag es genérico (ej: #Saint, #NA1), intentamos inferir o usar fallbacks comunes
        if (tagLine.toUpperCase() === 'SAINT') targetRegion = 'la2'; // Parche específico para el usuario

        riotService.setRegion(targetRegion);
        console.log(`🎯 Región Detectada: ${targetRegion} (Basada en #${tagLine})`);

        // 4. Obtener Datos de Invocador y Liga
        const summoner = await riotService.getSummoner(account.puuid);
        console.log(`👤 Summoner Info:`, { id: summoner?.id, puuid: account.puuid, level: summoner?.summonerLevel });

        let leagueData = null;
        try {
            console.log(`🔍 Buscando liga para PUUID: ${account.puuid} en ${targetRegion}`);
            const leagues = await riotService.getLeagueEntriesByPuuid(account.puuid);
            console.log(`📊 Ligas encontradas (${leagues.length}):`, JSON.stringify(leagues, null, 2));

            // Buscamos SoloQ primariamente, Flex como fallback
            leagueData = leagues.find((l: any) => l.queueType === 'RANKED_SOLO_5x5') ||
                leagues.find((l: any) => l.queueType === 'RANKED_FLEX_SR') || null;

            if (!leagueData && leagues.length > 0) {
                console.log(`⚠️ No se encontró SoloQ/Flex, usando primer rango disponible.`);
                leagueData = leagues[0];
            }
        } catch (e) {
            console.warn(`⚠️ Error en league-v4-by-puuid (${targetRegion}):`, e);
        }

        // 5. RIOT API: Obtener Partidas (Match-V5)
        riotService.setRegion('americas');
        const matchIds = await riotService.getMatchIds(account.puuid, 15);

        console.log(`⚡ Descargando ${matchIds.length} partidas para análisis...`);

        const matchesData = [];
        let totalKills = 0, totalDeaths = 0, totalAssists = 0;
        let totalDpm = 0, totalVision = 0, totalCs = 0, totalTimeMin = 0;
        let wins = 0;

        // Descarga en paralelo (Máximo rendimiento)
        const rawMatches = await Promise.all(
            matchIds.map(async (matchId: string) => {
                try {
                    return await riotService.getMatchDetails(matchId);
                } catch (err) {
                    return null;
                }
            })
        );

        for (const details of rawMatches) {
            if (details) {
                matchesData.push(details);
                const me = details.info?.participants?.find((p: any) => p.puuid === account.puuid);
                if (me) {
                    totalKills += me.kills;
                    totalDeaths += me.deaths;
                    totalAssists += me.assists;
                    totalDpm += me.challenges?.damagePerMinute || (me.totalDamageDealtToChampions / (details.info.gameDuration / 60));
                    totalVision += me.visionScore || 0;
                    totalCs += me.totalMinionsKilled + (me.neutralMinionsKilled || 0);
                    totalTimeMin += details.info.gameDuration / 60;
                    if (me.win) wins++;
                }
            }
        }

        // 6. GENERAR TAGS (Motor Analítico) 🧠
        const gamesCount = matchesData.length || 1;
        const totalTeamKills = matchesData.reduce((acc, m) => {
            const teamId = m.info?.participants?.find((p: any) => p.puuid === account.puuid)?.teamId;
            return acc + (m.info?.participants?.filter((p: any) => p.teamId === teamId).reduce((sum: number, p: any) => sum + p.kills, 0) || 0);
        }, 0);

        const playerStats: PlayerStats = {
            dpm: totalDpm / gamesCount,
            kda: (totalKills + totalAssists) / Math.max(1, totalDeaths),
            visionScore: totalVision / gamesCount,
            csMin: totalCs / Math.max(1, totalTimeMin),
            turretDmg: totalDpm * 0.4, // Estimado
            kp: (totalKills + totalAssists) / Math.max(1, totalTeamKills),
            soloKills: matchesData.reduce((acc, m) => acc + (m.info?.participants?.find((p: any) => p.puuid === account.puuid)?.soloKills || 0), 0) / gamesCount,
            deaths: totalDeaths / gamesCount
        };

        const generatedTags = TagEngine.generateTags(playerStats, BENCHMARKS);

        // 7. CALCULAR LENS
        const lensData = calculateLens(matchesData, account.puuid);

        // 8. PREPARAR DATOS DE LIGA (Corrección Winrate Real)
        const soloLeague = leagueData || {
            tier: 'UNRANKED',
            rank: '',
            leaguePoints: 0,
            wins: 0,
            losses: 0
        };

        // 9. PERSISTIR EN BASE DE DATOS (Para Autocomplete) 🗄️
        try {
            await prisma.summoner.upsert({
                where: { puuid: account.puuid },
                update: {
                    riotId: `${account.gameName}#${account.tagLine}`,
                    profileIconId: summoner?.profileIconId || 0,
                    summonerLevel: summoner?.summonerLevel || 0,
                    lastUpdated: new Error().stack?.includes('hot-reload') ? undefined : new Date(), // Evitar loops en dev
                },
                create: {
                    puuid: account.puuid,
                    riotId: `${account.gameName}#${account.tagLine}`,
                    region: targetRegion,
                    profileIconId: summoner?.profileIconId || 0,
                    summonerLevel: summoner?.summonerLevel || 0,
                    revisionDate: BigInt(summoner?.revisionDate || 0),
                }
            });
        } catch (dbError) {
            console.error('⚠️ Error al persistir summoner:', dbError);
        }

        // 10. RESPUESTA FINAL
        return NextResponse.json({
            profile: {
                ...account,
                summonerLevel: summoner?.summonerLevel || 0,
                profileIconId: summoner?.profileIconId || 0,
                id: summoner?.id
            },
            rank: {
                solo: soloLeague,
            },
            tags: generatedTags,
            lens: lensData,
            matches: matchesData
        });

    } catch (error: any) {
        console.error('🔥 Error Backend:', error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
