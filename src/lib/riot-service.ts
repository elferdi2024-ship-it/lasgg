import axios from 'axios';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
    minTime: 50, // Max 20 req/segundo (respetando límites de Riot)
    maxConcurrent: 5,
});

export class RiotService {
    private apiKey: string;
    private regionGroup = 'americas'; // Para cuentas (PUUID)
    private regionPlatform = 'la2';   // IMPORTANTE: 'la2' = LAS.

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    // --- NUEVO: CAMBIAR REGIÓN DINÁMICAMENTE ---
    setRegion(region: string) {
        this.regionPlatform = region;
    }

    private get headers() {
        return { 'X-Riot-Token': this.apiKey };
    }

    // 1. Obtener PUUID (Account V1)
    async getAccount(gameName: string, tagLine: string) {
        try {
            const url = `https://${this.regionGroup}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getAccount:", error);
            return null;
        }
    }

    // 1b. Obtener Shard Activo (Account V1) - Útil para detectar región real
    async getActiveShard(puuid: string, game: string = 'val') { // 'val' o 'lor', para LoL se suele inferir o usar 'val' shard mapping
        try {
            // Nota: El endpoint de LoL active shard no es tan directo como Val o LOR, 
            // pero podemos usar el mapping de tagLine o intentar inferir.
            // Por ahora seguiremos con el mapping mejorado.
            return null;
        } catch (e) { return null; }
    }

    // 2. Obtener Datos de Invocador (Summoner V4)
    async getSummoner(puuid: string) {
        try {
            const url = `https://${this.regionPlatform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getSummoner:", error);
            return null;
        }
    }

    // 3. Obtener Liga/Rank (League V4) - Por Summoner ID (Legacy)
    async getLeagueEntries(encryptedSummonerId: string) {
        try {
            const url = `https://${this.regionPlatform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getLeagueEntries:", error);
            return [];
        }
    }

    // 3b. Obtener Liga/Rank (League V4) - Por PUUID (Moderno)
    async getLeagueEntriesByPuuid(puuid: string) {
        try {
            const url = `https://${this.regionPlatform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getLeagueEntriesByPuuid:", error);
            return [];
        }
    }

    // 4. Obtener IDs de partidas
    async getMatchIds(puuid: string, count: number = 15) {
        try {
            const url = `https://${this.regionGroup}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getMatchIds:", error);
            return [];
        }
    }

    // 5. Obtener Detalles de Partida
    async getMatchDetails(matchId: string) {
        try {
            const url = `https://${this.regionGroup}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getMatchDetails:", error);
            return null;
        }
    }
    // 6. Obtener Partida Activa (Spectator V5)
    async getActiveGame(puuid: string) {
        try {
            const url = `https://${this.regionPlatform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // No está en partida
            }
            console.error("Error getActiveGame:", error.message);
            return null;
        }
    }
    // 7. Obtener Maestría de Campeones (Mastery V4)
    async getChampionMastery(puuid: string, count: number = 10) {
        try {
            const url = `https://${this.regionPlatform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`;
            const res = await limiter.schedule(() => axios.get(url, { headers: this.headers }));
            return res.data;
        } catch (error) {
            console.error("Error getChampionMastery:", error);
            return [];
        }
    }
}
