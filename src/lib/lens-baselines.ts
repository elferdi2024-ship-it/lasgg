// Promedios aproximados por Tier (Valores de referencia para el MVP)
// Extended with per-stat baselines for all Lens tabs

export interface TierBaseline {
    // Core (existing)
    cs: number;
    dpm: number;
    vis: number;
    kp: number;
    kda: number;
    solo: number;
    deaths: number;
    // Laning
    goldPerMin: number;
    plates: number;
    // Vision
    wardsPlaced: number;
    wardsDestroyed: number;
    controlWards: number;
    // Objectives
    dragonTakedowns: number;
    objectiveDmgPerMin: number;
    turretDmg: number;
    // Team
    ccPerGame: number;
    damageShare: number;
    // Fighting extras
    multikills: number;
    firstBloodRate: number;
}

export const TIER_BASELINES: Record<string, TierBaseline> = {
    'IRON': { cs: 4.5, dpm: 350, vis: 0.4, kp: 0.35, kda: 1.8, solo: 0.5, deaths: 7.5, goldPerMin: 280, plates: 0.3, wardsPlaced: 4, wardsDestroyed: 0.5, controlWards: 0.3, dragonTakedowns: 0.3, objectiveDmgPerMin: 150, turretDmg: 2000, ccPerGame: 15, damageShare: 0.20, multikills: 0.2, firstBloodRate: 0.10 },
    'BRONZE': { cs: 5.0, dpm: 400, vis: 0.6, kp: 0.40, kda: 2.0, solo: 0.8, deaths: 7.0, goldPerMin: 310, plates: 0.5, wardsPlaced: 5, wardsDestroyed: 1.0, controlWards: 0.5, dragonTakedowns: 0.5, objectiveDmgPerMin: 180, turretDmg: 2500, ccPerGame: 18, damageShare: 0.20, multikills: 0.3, firstBloodRate: 0.12 },
    'SILVER': { cs: 5.5, dpm: 480, vis: 0.8, kp: 0.42, kda: 2.2, solo: 1.0, deaths: 6.5, goldPerMin: 340, plates: 0.7, wardsPlaced: 6, wardsDestroyed: 1.5, controlWards: 0.8, dragonTakedowns: 0.6, objectiveDmgPerMin: 210, turretDmg: 3000, ccPerGame: 22, damageShare: 0.20, multikills: 0.4, firstBloodRate: 0.13 },
    'GOLD': { cs: 6.0, dpm: 550, vis: 1.0, kp: 0.45, kda: 2.5, solo: 1.2, deaths: 6.0, goldPerMin: 370, plates: 1.0, wardsPlaced: 7, wardsDestroyed: 2.0, controlWards: 1.0, dragonTakedowns: 0.8, objectiveDmgPerMin: 240, turretDmg: 3500, ccPerGame: 25, damageShare: 0.20, multikills: 0.5, firstBloodRate: 0.14 },
    'PLATINUM': { cs: 6.5, dpm: 620, vis: 1.2, kp: 0.48, kda: 2.8, solo: 1.5, deaths: 5.5, goldPerMin: 400, plates: 1.3, wardsPlaced: 8, wardsDestroyed: 2.5, controlWards: 1.3, dragonTakedowns: 0.9, objectiveDmgPerMin: 270, turretDmg: 4000, ccPerGame: 28, damageShare: 0.20, multikills: 0.6, firstBloodRate: 0.15 },
    'EMERALD': { cs: 7.0, dpm: 700, vis: 1.4, kp: 0.50, kda: 3.0, solo: 1.8, deaths: 5.0, goldPerMin: 430, plates: 1.5, wardsPlaced: 10, wardsDestroyed: 3.0, controlWards: 1.5, dragonTakedowns: 1.0, objectiveDmgPerMin: 300, turretDmg: 4500, ccPerGame: 32, damageShare: 0.20, multikills: 0.7, firstBloodRate: 0.16 },
    'DIAMOND': { cs: 7.5, dpm: 780, vis: 1.6, kp: 0.52, kda: 3.2, solo: 2.0, deaths: 4.8, goldPerMin: 460, plates: 1.8, wardsPlaced: 12, wardsDestroyed: 3.5, controlWards: 2.0, dragonTakedowns: 1.1, objectiveDmgPerMin: 330, turretDmg: 5000, ccPerGame: 35, damageShare: 0.20, multikills: 0.8, firstBloodRate: 0.17 },
    'MASTER': { cs: 8.2, dpm: 850, vis: 1.8, kp: 0.55, kda: 3.5, solo: 2.2, deaths: 4.5, goldPerMin: 490, plates: 2.0, wardsPlaced: 14, wardsDestroyed: 4.0, controlWards: 2.5, dragonTakedowns: 1.2, objectiveDmgPerMin: 360, turretDmg: 5500, ccPerGame: 38, damageShare: 0.20, multikills: 0.9, firstBloodRate: 0.18 },
    'GRANDMASTER': { cs: 8.8, dpm: 920, vis: 2.0, kp: 0.58, kda: 3.8, solo: 2.4, deaths: 4.2, goldPerMin: 510, plates: 2.2, wardsPlaced: 16, wardsDestroyed: 4.5, controlWards: 3.0, dragonTakedowns: 1.3, objectiveDmgPerMin: 390, turretDmg: 6000, ccPerGame: 40, damageShare: 0.20, multikills: 1.0, firstBloodRate: 0.19 },
    'CHALLENGER': { cs: 9.5, dpm: 1000, vis: 2.2, kp: 0.60, kda: 4.2, solo: 2.6, deaths: 3.8, goldPerMin: 540, plates: 2.5, wardsPlaced: 18, wardsDestroyed: 5.0, controlWards: 3.5, dragonTakedowns: 1.5, objectiveDmgPerMin: 420, turretDmg: 6500, ccPerGame: 45, damageShare: 0.20, multikills: 1.1, firstBloodRate: 0.20 },
};

export type TargetTier = keyof typeof TIER_BASELINES;
