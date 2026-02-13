import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RiotService } from '@/lib/riot-service';
import rateLimit from '@/lib/rate-limit';
import { z } from 'zod';

// Rate Limiter: 20 requests per minute per IP
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// Zod Schema
const SearchSchema = z.object({
    query: z.string().min(3).regex(/^[a-zA-Z0-9\s#]+$/, "Caracteres inválidos"),
});

const COMMON_TAGS = ['LAS', 'LAN', 'BR1', 'NA1', 'EUW', 'EUNE', 'KR', 'JP1'];

export async function GET(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        try {
            await limiter.check(20, ip);
        } catch {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        // 2. Input Validation
        const { searchParams } = new URL(req.url);
        const rawQuery = searchParams.get('q') || '';

        const validation = SearchSchema.safeParse({ query: rawQuery });
        if (!validation.success) {
            return NextResponse.json({ error: 'Query inválida', details: validation.error.format() }, { status: 400 });
        }

        const query = validation.data.query;

        // 3. BUSCAR EN BASE DE DATOS
        let dbResults: any[] = [];
        try {
            dbResults = await prisma.summoner.findMany({
                where: {
                    riotId: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                take: 10,
                orderBy: {
                    summonerLevel: 'desc'
                },
                select: {
                    riotId: true,
                    region: true,
                    profileIconId: true,
                    summonerLevel: true
                }
            });
        } catch (dbErr) {
            console.warn('⚠️ DB search failed, will try Riot API:', dbErr);
        }

        const formatted = dbResults.map(s => {
            const [name, tag] = s.riotId.split('#');
            return {
                name,
                tag,
                region: s.region,
                profileIconId: s.profileIconId,
                summonerLevel: s.summonerLevel
            };
        });

        // 4. Si la DB NO tiene resultados y el query tiene 5+ chars, intentar Riot API
        if (formatted.length === 0 && query.length >= 5) {
            const riotService = new RiotService(process.env.RIOT_API_KEY || '');
            const riotResults: any[] = [];

            if (query.includes('#')) {
                const [name, tag] = query.split('#');
                if (name.trim() && tag.trim()) {
                    const account = await riotService.getAccount(name.trim(), tag.trim());
                    if (account) {
                        riotResults.push({
                            name: account.gameName,
                            tag: account.tagLine,
                            region: 'LAS',
                            profileIconId: 0,
                            summonerLevel: 0,
                            source: 'riot'
                        });
                    }
                }
            } else {
                const tagsToTry = COMMON_TAGS.slice(0, 3);
                const attempts = await Promise.allSettled(
                    tagsToTry.map(tag => riotService.getAccount(query.trim(), tag))
                );

                for (let i = 0; i < attempts.length; i++) {
                    const result = attempts[i];
                    if (result.status === 'fulfilled' && result.value) {
                        riotResults.push({
                            name: result.value.gameName,
                            tag: result.value.tagLine,
                            region: tagsToTry[i],
                            profileIconId: 0,
                            summonerLevel: 0,
                            source: 'riot'
                        });
                    }
                }
            }

            if (riotResults.length > 0) {
                return NextResponse.json({ results: riotResults });
            }
        }

        return NextResponse.json({ results: formatted });

    } catch (error: any) {
        console.error('🔥 Search API Error:', error);
        return NextResponse.json({ error: 'Error en la búsqueda' }, { status: 500 });
    }
}
