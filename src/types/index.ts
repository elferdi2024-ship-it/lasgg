export interface LensMetric {
    category: 'Fighting' | 'Farming' | 'Vision' | 'Aggression' | 'Survivability' | 'Objectives';
    score: number;       // 0 a 100
    value: number;       // Valor real (ej: 8.5 CS/min)
    challengerAvg: number; // Valor de referencia
    label: string;       // Ej: "CS/min"
}

export interface LensAnalysis {
    globalScore: number;
    metrics: LensMetric[];
    tier: string; // "S+", "A", "B", etc.
}

// --- DETAILED PER-TAB STATS ---

export interface FightingStats {
    killParticipation: number;   // 0-1 ratio
    damagePerMinute: number;
    damageShare: number;         // 0-1 ratio (% of team damage)
    soloKillsPerGame: number;
    multikillsPerGame: number;   // avg multi-kills per game
    firstBloodRate: number;      // 0-1 ratio
    killsPerGame: number;
    assistsPerGame: number;
}

export interface LaningStats {
    csPerMin: number;
    goldPerMin: number;
    platesPerGame: number;       // turret plates taken avg
    xpPerMin: number;
}

export interface VisionStats {
    visionScorePerMin: number;
    wardsPlacedPerGame: number;
    wardsDestroyedPerGame: number;
    controlWardsPerGame: number;
}

export interface SurvivabilityStats {
    deathsPerGame: number;
    survivalRate: number;        // % of games with ≤3 deaths
    deathShare: number;          // 0-1 ratio (% of team deaths)
}

export interface ObjectivesStats {
    dragonTakedownsPerGame: number;
    objectiveDamagePerMin: number;
    turretDamagePerGame: number;
}

export interface TeamImpactStats {
    killParticipation: number;   // 0-1 ratio
    ccTimePerGame: number;       // total CC seconds dealt per game
    damageShare: number;         // 0-1 ratio
    assistRatio: number;         // assists / (kills + assists)
}

export interface DetailedLensAnalysis extends LensAnalysis {
    fighting: FightingStats;
    laning: LaningStats;
    vision: VisionStats;
    survivability: SurvivabilityStats;
    objectives: ObjectivesStats;
    team: TeamImpactStats;
}

export interface Participant {
    puuid: string;
    championName: string;
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    totalMinionsKilled: number;
    neutralMinionsKilled: number;
    totalDamageDealtToChampions: number;
    visionScore: number;
    goldEarned: number;
    wardsPlaced: number;
    wardsKilled: number;
    detectorWardsPlaced: number;
    turretTakedowns: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    totalTimeCCDealt: number;
    timeCCingOthers: number;
    firstBloodKill: boolean;
    teamId: number;
    individualPosition: string;
    teamPosition: string;
    lane: string;
    role: string;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    challenges?: {
        kda?: number;
        killParticipation?: number;
        damagePerMinute?: number;
        visionScorePerMinute?: number;
        soloKills?: number;
        turretPlatesTaken?: number;
        dragonTakedowns?: number;
        teamDamagePercentage?: number;
        multikills?: number;
        goldPerMinute?: number;
    };
}

// --- LIVE GAME / SPECTATOR V5 ---

export interface BannedChampion {
    championId: number;
    teamId: number;
    pickTurn: number;
}

export interface CurrentGameParticipant {
    championId: number;
    perks: {
        perkIds: number[];
        perkStyle: number;
        perkSubStyle: number;
    };
    profileIconId: number;
    bot: boolean;
    teamId: number;
    summonerName: string;
    summonerId: string;
    spell1Id: number;
    spell2Id: number;
    gameCustomizationObjects: any[];
}

export interface ActiveGameInfo {
    gameId: number;
    mapId: number;
    gameMode: string;
    gameType: string;
    gameQueueConfigId: number;
    participants: CurrentGameParticipant[];
    observers: { encryptionKey: string };
    platformId: string;
    bannedChampions: BannedChampion[];
    gameStartTime: number;
    gameLength: number;
}

// --- CHAMPION MASTERY V4 ---

export interface ChampionMastery {
    puuid: string;
    championId: number;
    championLevel: number;
    championPoints: number;
    lastPlayTime: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
    chestGranted: boolean;
    tokensEarned: number;
    summonerId: string;
}

// --- PROFILE DATA AGGREGATION ---

export interface SummonerProfile {
    gameName: string;
    tagLine: string;
    puuid: string;
    profileIconId: number;
    summonerLevel: number;
    region?: string;
}

export interface RankedStats {
    wins: number;
    losses: number;
    leaguePoints?: number;
    tier?: string;
    rank?: string;
}

export interface PlayerTag {
    label: string;
    type: string; // 'STRENGTH' | 'WEAKNESS' | 'NEUTRAL'
}

export interface Match {
    metadata: {
        matchId: string;
        participants: string[];
    };
    info: {
        gameCreation: number;
        gameDuration: number;
        gameEndTimestamp: number;
        gameId: number;
        gameMode: string;
        gameName: string;
        gameStartTimestamp: number;
        gameType: string;
        gameVersion: string;
        mapId: number;
        participants: Participant[];
        platformId: string;
        queueId: number;
        teams: any[]; // Define Team if needed
        tournamentCode: string;
    };
}

export interface SummonerProfileData {
    profile: SummonerProfile;
    rank?: {
        solo?: RankedStats;
        flex?: RankedStats;
    };
    tags?: PlayerTag[];
    matches?: Match[];
    lens?: DetailedLensAnalysis;
}
