import { LensAnalysis, LensMetric, DetailedLensAnalysis, FightingStats, LaningStats, VisionStats, SurvivabilityStats, ObjectivesStats, TeamImpactStats, Participant } from "@/types";
import { TIER_BASELINES, TargetTier } from "./lens-baselines";

/**
 * Original simplified lens (kept for backward compat with Overview tab).
 */
export function calculateLens(matches: any[], puuid: string, targetTier: TargetTier = 'EMERALD'): LensAnalysis {
    const detailed = calculateDetailedLens(matches, puuid, targetTier);
    return { globalScore: detailed.globalScore, metrics: detailed.metrics, tier: detailed.tier };
}

/**
 * Full detailed analysis powering all 7 Lens tabs.
 */
export function calculateDetailedLens(matches: any[], puuid: string, targetTier: TargetTier = 'EMERALD'): DetailedLensAnalysis {
    if (!matches || matches.length === 0) return createEmptyDetailed();

    const BASELINE = TIER_BASELINES[targetTier];

    // Accumulators
    let totalCsMin = 0, totalDpm = 0, totalVisionMin = 0, totalKp = 0;
    let totalSoloKills = 0, totalDeaths = 0;
    let totalKills = 0, totalAssists = 0;
    let totalDamageShare = 0, totalMultikills = 0, firstBloods = 0;
    let totalGoldPerMin = 0, totalPlates = 0, totalXpPerMin = 0;
    let totalWardsPlaced = 0, totalWardsDestroyed = 0, totalControlWards = 0;
    let lowDeathGames = 0, totalDeathShare = 0;
    let totalDragonTakedowns = 0, totalObjDmgPerMin = 0, totalTurretDmg = 0;
    let totalCcPerGame = 0;
    let validGames = 0;

    matches.forEach(match => {
        const me = match.info?.participants?.find((p: any) => p.puuid === puuid) as Participant | undefined;
        if (!me) return;

        const durationMin = match.info.gameDuration / 60;
        if (durationMin < 5) return; // skip remakes

        const teammates = match.info.participants.filter((p: any) => p.teamId === me.teamId);
        const teamKills = teammates.reduce((a: number, b: any) => a + b.kills, 0) || 1;
        const teamDeaths = teammates.reduce((a: number, b: any) => a + b.deaths, 0) || 1;
        const teamDamage = teammates.reduce((a: number, b: any) => a + b.totalDamageDealtToChampions, 0) || 1;

        // Core
        const cs = me.totalMinionsKilled + (me.neutralMinionsKilled || 0);
        const csMin = cs / durationMin;
        const dpm = me.challenges?.damagePerMinute || (me.totalDamageDealtToChampions / durationMin);
        const visionMin = me.challenges?.visionScorePerMinute || (me.visionScore / durationMin);
        const kp = me.challenges?.killParticipation || ((me.kills + me.assists) / teamKills);

        // Fighting
        const damageShare = me.challenges?.teamDamagePercentage || (me.totalDamageDealtToChampions / teamDamage);
        const soloKills = me.challenges?.soloKills || 0;
        const multikills = me.challenges?.multikills ||
            ((me as any).doubleKills || 0) + ((me as any).tripleKills || 0) + ((me as any).quadraKills || 0) + ((me as any).pentaKills || 0);
        const firstBlood = (me as any).firstBloodKill ? 1 : 0;

        // Laning
        const goldPerMin = me.challenges?.goldPerMinute || (me.goldEarned / durationMin);
        const plates = me.challenges?.turretPlatesTaken || 0;
        const xpPerMin = ((me as any).champExperience || 0) / durationMin;

        // Vision
        const wardsPlaced = (me as any).wardsPlaced || 0;
        const wardsDestroyed = (me as any).wardsKilled || 0;
        const controlWards = (me as any).detectorWardsPlaced || (me as any).visionWardsBoughtInGame || 0;

        // Survivability
        const deathShare = me.deaths / teamDeaths;
        if (me.deaths <= 3) lowDeathGames++;

        // Objectives
        const dragonTakedowns = me.challenges?.dragonTakedowns || 0;
        const objDmgPerMin = ((me as any).damageDealtToObjectives || 0) / durationMin;
        const turretDmg = (me as any).damageDealtToTurrets || 0;

        // Team
        const ccTime = (me as any).totalTimeCCDealt || (me as any).timeCCingOthers || 0;

        // Accumulate
        totalCsMin += csMin;
        totalDpm += dpm;
        totalVisionMin += visionMin;
        totalKp += kp;
        totalSoloKills += soloKills;
        totalDeaths += me.deaths;
        totalKills += me.kills;
        totalAssists += me.assists;
        totalDamageShare += damageShare;
        totalMultikills += multikills;
        firstBloods += firstBlood;
        totalGoldPerMin += goldPerMin;
        totalPlates += plates;
        totalXpPerMin += xpPerMin;
        totalWardsPlaced += wardsPlaced;
        totalWardsDestroyed += wardsDestroyed;
        totalControlWards += controlWards;
        totalDeathShare += deathShare;
        totalDragonTakedowns += dragonTakedowns;
        totalObjDmgPerMin += objDmgPerMin;
        totalTurretDmg += turretDmg;
        totalCcPerGame += ccTime;
        validGames++;
    });

    if (validGames === 0) return createEmptyDetailed();

    const n = validGames;

    // --- AVERAGES ---
    const avgCsMin = totalCsMin / n;
    const avgDpm = totalDpm / n;
    const avgVisionMin = totalVisionMin / n;
    const avgKp = totalKp / n;
    const avgSoloKills = totalSoloKills / n;
    const avgDeaths = totalDeaths / n;

    // --- CATEGORY SCORES (for Overview radar) ---
    const farmingScore = Math.min(100, (avgCsMin / BASELINE.cs) * 100);
    const fightingScore = Math.min(100, (avgDpm / BASELINE.dpm) * 100);
    const visionScore = Math.min(100, (avgVisionMin / BASELINE.vis) * 100);
    const aggressionScore = Math.min(100, (avgSoloKills / BASELINE.solo) * 100);
    const survivabilityScore = Math.max(0, 100 - (avgDeaths * (100 / BASELINE.deaths)));
    const teamImpactScore = Math.min(100, (avgKp / BASELINE.kp) * 100);

    const metrics: LensMetric[] = [
        { category: 'Farming', score: Math.round(farmingScore), value: avgCsMin, challengerAvg: BASELINE.cs, label: 'CS/min' },
        { category: 'Fighting', score: Math.round(fightingScore), value: avgDpm, challengerAvg: BASELINE.dpm, label: 'DPM' },
        { category: 'Vision', score: Math.round(visionScore), value: avgVisionMin, challengerAvg: BASELINE.vis, label: 'Vis/min' },
        { category: 'Aggression', score: Math.round(aggressionScore), value: avgSoloKills, challengerAvg: BASELINE.solo, label: 'Solo Kills' },
        { category: 'Survivability', score: Math.round(survivabilityScore), value: avgDeaths, challengerAvg: BASELINE.deaths, label: 'Muertes/Partida' },
        { category: 'Objectives', score: Math.round(teamImpactScore), value: avgKp * 100, challengerAvg: BASELINE.kp * 100, label: 'KP%' },
    ];

    const globalScore = Math.round(metrics.reduce((acc, curr) => acc + curr.score, 0) / metrics.length);

    // --- PER-TAB DETAILED STATS ---
    const fighting: FightingStats = {
        killParticipation: avgKp,
        damagePerMinute: avgDpm,
        damageShare: totalDamageShare / n,
        soloKillsPerGame: avgSoloKills,
        multikillsPerGame: totalMultikills / n,
        firstBloodRate: firstBloods / n,
        killsPerGame: totalKills / n,
        assistsPerGame: totalAssists / n,
    };

    const laning: LaningStats = {
        csPerMin: avgCsMin,
        goldPerMin: totalGoldPerMin / n,
        platesPerGame: totalPlates / n,
        xpPerMin: totalXpPerMin / n,
    };

    const vision: VisionStats = {
        visionScorePerMin: avgVisionMin,
        wardsPlacedPerGame: totalWardsPlaced / n,
        wardsDestroyedPerGame: totalWardsDestroyed / n,
        controlWardsPerGame: totalControlWards / n,
    };

    const survivability: SurvivabilityStats = {
        deathsPerGame: avgDeaths,
        survivalRate: lowDeathGames / n,
        deathShare: totalDeathShare / n,
    };

    const objectives: ObjectivesStats = {
        dragonTakedownsPerGame: totalDragonTakedowns / n,
        objectiveDamagePerMin: totalObjDmgPerMin / n,
        turretDamagePerGame: totalTurretDmg / n,
    };

    const team: TeamImpactStats = {
        killParticipation: avgKp,
        ccTimePerGame: totalCcPerGame / n,
        damageShare: totalDamageShare / n,
        assistRatio: totalAssists / Math.max(1, totalKills + totalAssists),
    };

    return {
        globalScore,
        metrics,
        tier: calculateLetterGrade(globalScore),
        fighting,
        laning,
        vision,
        survivability,
        objectives,
        team,
    };
}

function calculateLetterGrade(score: number) {
    if (score >= 90) return 'S+';
    if (score >= 80) return 'S';
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
}

function createEmptyDetailed(): DetailedLensAnalysis {
    return {
        globalScore: 0, metrics: [], tier: 'Unranked',
        fighting: { killParticipation: 0, damagePerMinute: 0, damageShare: 0, soloKillsPerGame: 0, multikillsPerGame: 0, firstBloodRate: 0, killsPerGame: 0, assistsPerGame: 0 },
        laning: { csPerMin: 0, goldPerMin: 0, platesPerGame: 0, xpPerMin: 0 },
        vision: { visionScorePerMin: 0, wardsPlacedPerGame: 0, wardsDestroyedPerGame: 0, controlWardsPerGame: 0 },
        survivability: { deathsPerGame: 0, survivalRate: 0, deathShare: 0 },
        objectives: { dragonTakedownsPerGame: 0, objectiveDamagePerMin: 0, turretDamagePerGame: 0 },
        team: { killParticipation: 0, ccTimePerGame: 0, damageShare: 0, assistRatio: 0 },
    };
}
