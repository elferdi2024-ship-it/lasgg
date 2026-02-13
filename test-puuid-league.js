const API_KEY = "RGAPI-91c289b6-5837-4580-8c9b-08cb5be5f0b9";
const PUUID = "y_takPtrzg73EIfOijOnQchgJHBPtk0Av3m6Q7H7ESf2GFX_P4jsqhb33mZE99MzxSSnjP5m_iGyZA";
const REGION = "la2";

async function testPUUIDLeague() {
    console.log(`--- Testing league-v4 by PUUID in ${REGION} ---`);
    const url = `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-puuid/${PUUID}`;
    try {
        const res = await fetch(url, { headers: { 'X-Riot-Token': API_KEY } });
        const data = await res.json();
        console.log("League Data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
testPUUIDLeague();
