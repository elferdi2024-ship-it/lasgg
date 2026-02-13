import { useState, useEffect } from 'react';

const DDRAGON_VERSION = '14.3.1'; // Or fetch dynamically
const CHAMPION_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/champion.json`;
const SPELL_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/summoner.json`;

interface ChampionMap {
    [key: number]: string; // ID -> Name (e.g., 266 -> Aatrox)
}

interface SpellMap {
    [key: number]: string; // ID -> Name (e.g., 4 -> SummonerFlash)
}

export function useChampions() {
    const [champions, setChampions] = useState<ChampionMap>({});
    const [spells, setSpells] = useState<SpellMap>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Champions
                const champRes = await fetch(CHAMPION_URL);
                const champData = await champRes.json();
                const champMap: ChampionMap = {};

                Object.values(champData.data).forEach((c: any) => {
                    champMap[parseInt(c.key)] = c.id;
                });
                setChampions(champMap);

                // Fetch Spells
                const spellRes = await fetch(SPELL_URL);
                const spellData = await spellRes.json();
                const spellMap: SpellMap = {};

                Object.values(spellData.data).forEach((s: any) => {
                    spellMap[parseInt(s.key)] = s.id;
                });
                setSpells(spellMap);

            } catch (error) {
                console.error("Error fetching DDragon data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getChampionName = (id: number) => champions[id] || 'Aatrox'; // Fallback
    const getSpellName = (id: number) => spells[id] || 'SummonerFlash';

    return { getChampionName, getSpellName, loading };
}
