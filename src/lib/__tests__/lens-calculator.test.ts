import { calculateDetailedLens } from '../lens-calculator';

describe('LensCalculator', () => {
    const puuid = 'test-puuid';
    const mockMatch = {
        info: {
            gameDuration: 1800, // 30 min
            participants: [
                {
                    puuid: 'test-puuid',
                    teamId: 100,
                    totalMinionsKilled: 200,
                    neutralMinionsKilled: 10,
                    totalDamageDealtToChampions: 30000,
                    visionScore: 30,
                    kills: 5,
                    deaths: 2,
                    assists: 10,
                    goldEarned: 12000,
                    item0: 1,
                    challenges: {
                        damagePerMinute: 1000,
                        visionScorePerMinute: 1.0,
                        killParticipation: 0.5,
                        soloKills: 1
                    }
                },
                { teamId: 100, kills: 5, deaths: 5, totalDamageDealtToChampions: 20000 },
                { teamId: 200 } // Enemy
            ]
        }
    };

    it('should calculate scores correctly for a single match', () => {
        const result = calculateDetailedLens([mockMatch], puuid, 'EMERALD');

        expect(result).toBeDefined();
        // 210 CS / 30 min = 7 CS/min
        expect(result.metrics.find(m => m.category === 'Farming')?.value).toBe(7);
        // DPM 1000
        expect(result.metrics.find(m => m.category === 'Fighting')?.value).toBe(1000);
    });

    it('should return empty analysis for no matches', () => {
        const result = calculateDetailedLens([], puuid);
        expect(result.globalScore).toBe(0);
        expect(result.tier).toBe('Unranked');
    });

    it('should handle missing participant gracefully', () => {
        const result = calculateDetailedLens([mockMatch], 'wrong-puuid');
        expect(result.globalScore).toBe(0);
    });
});
