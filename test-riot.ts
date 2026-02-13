import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.RIOT_API_KEY;
const RIOT_ID = "Kamyu de Aquario";
const TAG_LINE = "Saint";

async function test() {
    console.log(`--- Testing Riot API for ${RIOT_ID}#${TAG_LINE} ---`);
    try {
        // 1. Account-V1 (Americas)
        const accUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(RIOT_ID)}/${encodeURIComponent(TAG_LINE)}`;
        const accRes = await axios.get(accUrl, { headers: { 'X-Riot-Token': API_KEY } });
        const puuid = accRes.data.puuid;
        console.log("PUUID Found:", puuid);

        // 2. Summoner-V4 (LAS = la2)
        const regions = ['la2', 'br1', 'na1'];
        for (const reg of regions) {
            console.log(`\nChecking Region: ${reg}`);
            try {
                const summUrl = `https://${reg}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
                const summRes = await axios.get(summUrl, { headers: { 'X-Riot-Token': API_KEY } });
                const summId = summRes.data.id;
                console.log(`Summoner ID for ${reg}:`, summId);

                // 3. League-V4
                const leagueUrl = `https://${reg}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summId}`;
                const leagueRes = await axios.get(leagueUrl, { headers: { 'X-Riot-Token': API_KEY } });
                console.log(`Leagues in ${reg}:`, JSON.stringify(leagueRes.data, null, 2));
            } catch (e: any) {
                console.log(`Error in ${reg}:`, e.response?.status || e.message);
            }
        }
    } catch (e: any) {
        console.error("Critical Error:", e.response?.data || e.message);
    }
}

test();
