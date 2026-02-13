const API_KEY = "RGAPI-91c289b6-5837-4580-8c9b-08cb5be5f0b9";
const RIOT_ID = "Kamyu de Aquario";
const TAG_LINE = "Saint";

async function test() {
    console.log(`--- Testing Riot API (Expanded) for ${RIOT_ID}#${TAG_LINE} ---`);
    try {
        const accUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(RIOT_ID)}/${encodeURIComponent(TAG_LINE)}`;
        const accRes = await fetch(accUrl, { headers: { 'X-Riot-Token': API_KEY } });
        const account = await accRes.json();
        const puuid = account.puuid;
        console.log("PUUID:", puuid);

        const regions = ['la2', 'la1', 'br1', 'na1'];
        for (const reg of regions) {
            console.log(`\n--- Region: ${reg} ---`);
            const summUrl = `https://${reg}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
            const summRes = await fetch(summUrl, { headers: { 'X-Riot-Token': API_KEY } });
            const summoner = await summRes.json();
            console.log(`Summoner V4 Response (${reg}):`, JSON.stringify(summoner, null, 2));

            if (summoner.id) {
                const leagueUrl = `https://${reg}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`;
                const leagueRes = await fetch(leagueUrl, { headers: { 'X-Riot-Token': API_KEY } });
                const leagues = await leagueRes.json();
                console.log(`Leagues Found (${reg}):`, JSON.stringify(leagues, null, 2));
            } else if (summoner.puuid) {
                console.log(`Warning: No 'id' found in ${reg}, trying to see if league-v4 accepts puuid (unlikely)`);
                try {
                    const leagueUrl = `https://${reg}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.puuid}`;
                    const leagueRes = await fetch(leagueUrl, { headers: { 'X-Riot-Token': API_KEY } });
                    const leagues = await leagueRes.json();
                    console.log(`Leagues by PUUID? (${reg}):`, JSON.stringify(leagues, null, 2));
                } catch (e) { }
            }
        }
    } catch (e) { console.error(e); }
}
test();
