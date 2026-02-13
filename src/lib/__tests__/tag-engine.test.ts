import { TagEngine, PlayerStats, Benchmark } from '../tag-engine';

describe('TagEngine', () => {
    const mockBenchmarks: Record<keyof PlayerStats, Benchmark> = {
        dpm: { avg: 500, stdDev: 100 },
        kda: { avg: 2.5, stdDev: 1.0 },
        visionScore: { avg: 1.0, stdDev: 0.5 },
        csMin: { avg: 6.0, stdDev: 1.0 },
        turretDmg: { avg: 2000, stdDev: 1000 },
        kp: { avg: 0.5, stdDev: 0.1 },
        soloKills: { avg: 2.0, stdDev: 1.0 },
        deaths: { avg: 5.0, stdDev: 2.0 }
    };

    describe('calculateZScore', () => {
        it('should calculate z-score correctly', () => {
            const benchmark = { avg: 10, stdDev: 2 };
            expect(TagEngine.calculateZScore(12, benchmark)).toBe(1); // (12-10)/2 = 1
            expect(TagEngine.calculateZScore(8, benchmark)).toBe(-1); // (8-10)/2 = -1
        });

        it('should handle zero stdDev', () => {
            const benchmark = { avg: 10, stdDev: 0 };
            expect(TagEngine.calculateZScore(12, benchmark)).toBe(0);
        });
    });

    describe('generateTags', () => {
        it('should generate STRENGTH tags for high performance', () => {
            const stats: PlayerStats = {
                dpm: 800, // Z = 3 (Extreme) -> DAMAGE_DEMON
                kda: 2.5,
                visionScore: 1.0,
                csMin: 6.0,
                turretDmg: 2000,
                kp: 0.5,
                soloKills: 2.0,
                deaths: 5.0
            };

            const tags = TagEngine.generateTags(stats, mockBenchmarks);
            expect(tags).toHaveLength(1);
            expect(tags[0].label).toBe('DAMAGE_DEMON');
            expect(tags[0].severity).toBe('EXTREME');
        });

        it('should generate WEAKNESS tags for low performance', () => {
            const stats: PlayerStats = {
                dpm: 200, // Z = -3 -> PASSIVE
                kda: 2.5,
                visionScore: 1.0,
                csMin: 6.0,
                turretDmg: 2000,
                kp: 0.5,
                soloKills: 2.0,
                deaths: 5.0
            };

            const tags = TagEngine.generateTags(stats, mockBenchmarks);
            expect(tags).toHaveLength(1);
            expect(tags[0].label).toBe('PASSIVE');
            expect(tags[0].type).toBe('WEAKNESS');
        });

        it('should identify SAFE_PLAYER (low deaths)', () => {
            const stats: PlayerStats = {
                dpm: 500,
                kda: 2.5,
                visionScore: 1.0,
                csMin: 6.0,
                turretDmg: 2000,
                kp: 0.5,
                soloKills: 2.0,
                deaths: 1.0 // Z = (1-5)/2 = -2. Inverted -> 2 (High) -> SAFE_PLAYER
            };

            const tags = TagEngine.generateTags(stats, mockBenchmarks);
            const safeTag = tags.find(t => t.label === 'SAFE_PLAYER');
            expect(safeTag).toBeDefined();
            expect(safeTag?.severity).toBe('HIGH');
        });
    });
});
