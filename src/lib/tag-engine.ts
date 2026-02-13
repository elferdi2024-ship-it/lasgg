export interface Benchmark {
    avg: number;
    stdDev: number;
}

export interface PlayerStats {
    dpm: number;
    kda: number;
    visionScore: number;
    csMin: number;
    turretDmg: number;
    kp: number; // Kill Participation
    soloKills: number;
    deaths: number;
}

export type TagLabel =
    | "LANE_BULLY" | "VISION_GOD" | "KDA_PLAYER" | "FARM_MACHINE" | "STRUCTURE_DESTROYER"
    | "DAMAGE_DEMON" | "UNSTOPPABLE" | "DUELIST" | "OBJECTIVE_KING" | "MAP_HACKER" | "GOLD_HYPERCAR" | "STABLE_PERFORMER"
    | "FRAGILE" | "VISION_BLIND" | "FARM_DRY" | "PASSIVE" | "LOW_IMPACT" | "TEAM_PLAYER" | "SOLO_CARRY" | "GLASS_CANNON" | "OBJECTIVE_BLIND" | "RISKY_PLAYER" | "SAFE_PLAYER";

export interface TagResult {
    label: TagLabel;
    severity: "NORMAL" | "HIGH" | "EXTREME";
    score: number;
    description: string;
    type: "STRENGTH" | "WEAKNESS";
}

export const TagEngine = {
    calculateZScore(value: number, benchmark: Benchmark): number {
        if (benchmark.stdDev === 0) return 0;
        return (value - benchmark.avg) / benchmark.stdDev;
    },

    generateTags(stats: PlayerStats, benchmarks: Record<keyof PlayerStats, Benchmark>): TagResult[] {
        let tags: TagResult[] = [];

        const metrics = [
            { key: 'dpm', strength: 'DAMAGE_DEMON', weakness: 'PASSIVE', descS: 'Daño masivo.', descW: 'Bajo impacto en combate.' },
            { key: 'visionScore', strength: 'VISION_GOD', weakness: 'VISION_BLIND', descS: 'Control de mapa total.', descW: 'Nula visión del mapa.' },
            { key: 'csMin', strength: 'FARM_MACHINE', weakness: 'FARM_DRY', descS: 'Farmeo perfecto.', descW: 'Economía deficiente.' },
            { key: 'kp', strength: 'TEAM_PLAYER', weakness: 'SOLO_CARRY', descS: 'Excelente juego en equipo.', descW: 'Juego muy individualista.' },
            { key: 'soloKills', strength: 'DUELIST', weakness: 'LOW_IMPACT', descS: 'Dominio absoluto en 1v1.', descW: 'Falta de presión individual.' },
            { key: 'turretDmg', strength: 'STRUCTURE_DESTROYER', weakness: 'OBJECTIVE_BLIND', descS: 'Demoledor de torres.', descW: 'Ignora los objetivos.' },
            { key: 'deaths', strength: 'SAFE_PLAYER', weakness: 'RISKY_PLAYER', descS: 'Posicionamiento impecable.', descW: 'Exceso de riesgos innecesarios.', invert: true },
        ];

        // 1. First Pass: Strict Thresholds (Z > 1.2 or Z < -1.2)
        metrics.forEach(m => {
            const z = this.calculateZScore(stats[m.key as keyof PlayerStats], benchmarks[m.key as keyof PlayerStats]);
            const val = m.invert ? -z : z;

            if (val > 1.2) {
                tags.push({
                    label: m.strength as TagLabel,
                    severity: val > 2.2 ? "EXTREME" : val > 1.7 ? "HIGH" : "NORMAL",
                    score: z,
                    description: m.descS,
                    type: "STRENGTH"
                });
            } else if (val < -1.2) {
                tags.push({
                    label: m.weakness as TagLabel,
                    severity: val < -2.2 ? "EXTREME" : val < -1.7 ? "HIGH" : "NORMAL",
                    score: z,
                    description: m.descW,
                    type: "WEAKNESS"
                });
            }
        });

        // 2. Second Pass: If less than 5 tags, lower thresholds to 0.6
        if (tags.length < 5) {
            metrics.forEach(m => {
                const z = this.calculateZScore(stats[m.key as keyof PlayerStats], benchmarks[m.key as keyof PlayerStats]);
                const val = m.invert ? -z : z;

                // Only add if not already present
                if (!tags.find(t => t.label === m.strength || t.label === m.weakness)) {
                    if (val > 0.6) {
                        tags.push({
                            label: m.strength as TagLabel,
                            severity: "NORMAL",
                            score: z,
                            description: m.descS,
                            type: "STRENGTH"
                        });
                    } else if (val < -0.6) {
                        tags.push({
                            label: m.weakness as TagLabel,
                            severity: "NORMAL",
                            score: z,
                            description: m.descW,
                            type: "WEAKNESS"
                        });
                    }
                }
            });
        }

        // Limit to 8 tags max to avoid clutter, prioritizing extreme scores
        return tags.sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 8);
    },
};
