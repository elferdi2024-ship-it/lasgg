'use client';
import { LensLayout } from './LensLayout';
import { LensStatCard, LensStatBox, LensDistribution, LensComparisonBar } from './LensUI';
import LensCanvas from './LensCanvas';
import { DetailedLensAnalysis } from '@/types';
import { TierBaseline, TIER_BASELINES, TargetTier } from '@/lib/lens-baselines';
import { ProfessionalCoach } from './ProfessionalCoach';

// Helpers
const fmt = (v: number, decimals = 1) => v % 1 === 0 ? String(v) : v.toFixed(decimals);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const trend = (val: number, base: number) => val >= base ? 'up' : 'down';
const tierSub = (val: number, base: number, unit = '') =>
    val >= base ? `▲ Supera ${fmt(base)}${unit}` : `▼ Debajo de ${fmt(base)}${unit}`;

// --- 1. OVERVIEW TAB ---
export const OverviewTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: string }) => {
    const categoryMap: Record<string, string> = {
        Fighting: 'Combate', Farming: 'Fase de Líneas', Vision: 'Visión',
        Aggression: 'Agresión', Survivability: 'Supervivencia', Objectives: 'Objetivos'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-4 flex flex-col gap-2">
                {data.metrics.map((m, i) => (
                    <LensStatCard
                        key={i}
                        title={categoryMap[m.category] || m.category}
                        subtitle={`vs ${targetTier}`}
                        score={m.score}
                        color={m.score > 70 ? '#4CD964' : m.score > 50 ? '#F5C451' : '#FF5C5C'}
                    />
                ))}
            </div>
            <div className="lg:col-span-8 flex items-center justify-center bg-bg-card-soft/30 rounded-xl border border-border-dark">
                <LensCanvas data={data} />
            </div>

            {/* COACH PROFESSIONAL ADDITION */}
            <div className="lg:col-span-12">
                <ProfessionalCoach data={data} targetTier={targetTier as TargetTier} />
            </div>
        </div>
    );
};

// --- 2. FIGHTING TAB ---
export const FightingTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const f = data.fighting;
    const b = TIER_BASELINES[targetTier];
    const fightMetric = data.metrics.find(m => m.category === 'Fighting');
    const aggrMetric = data.metrics.find(m => m.category === 'Aggression');

    return (
        <LensLayout
            leftContent={
                <>
                    <LensStatCard title="Combate General" subtitle={`VS ${targetTier}`} score={fightMetric?.score || 0} color="#5B6CFF" active />
                    <LensStatCard title="Agresión" subtitle="SOLO KILLS & FIRST BLOOD" score={aggrMetric?.score || 0} color="#FF9F43" />
                    <LensComparisonBar label="Daño/Min" playerValue={Math.round(f.damagePerMinute)} baseline={b.dpm} color="#5B6CFF" />
                    <LensComparisonBar label="Solo Kills/Partida" playerValue={+f.soloKillsPerGame.toFixed(1)} baseline={b.solo} color="#FF9F43" />
                </>
            }
            rightContent={
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <LensStatBox label="Participación en Kills" value={pct(f.killParticipation)} trend={trend(f.killParticipation, b.kp)} subtext={tierSub(f.killParticipation, b.kp)} />
                        <LensStatBox label="Daño / Min" value={fmt(f.damagePerMinute, 0)} trend={trend(f.damagePerMinute, b.dpm)} subtext={tierSub(f.damagePerMinute, b.dpm)} />
                        <LensStatBox label="Cuota de Daño" value={pct(f.damageShare)} trend={trend(f.damageShare, b.damageShare)} subtext="% del daño del equipo" />
                        <LensStatBox label="Kills en Solitario" value={fmt(f.soloKillsPerGame)} trend={trend(f.soloKillsPerGame, b.solo)} />
                        <LensStatBox label="Multikills / Partida" value={fmt(f.multikillsPerGame)} trend={trend(f.multikillsPerGame, b.multikills)} />
                        <LensStatBox label="Primera Sangre %" value={pct(f.firstBloodRate)} trend={trend(f.firstBloodRate, b.firstBloodRate)} />
                    </div>
                    <LensDistribution playerValue={f.damagePerMinute} baseline={b.dpm} label="Distribución DPM vs Rango" />
                </>
            }
        />
    );
};

// --- 3. LANING TAB ---
export const LaningTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const l = data.laning;
    const b = TIER_BASELINES[targetTier];
    const farmMetric = data.metrics.find(m => m.category === 'Farming');

    return (
        <LensLayout
            leftContent={
                <>
                    <LensStatCard title="Farming" subtitle={`VS ${targetTier}`} score={farmMetric?.score || 0} color="#F5C451" active />
                    <LensComparisonBar label="CS / Min" playerValue={+l.csPerMin.toFixed(1)} baseline={b.cs} color="#F5C451" />
                    <LensComparisonBar label="Oro / Min" playerValue={Math.round(l.goldPerMin)} baseline={b.goldPerMin} color="#FFC84E" />
                    <LensComparisonBar label="Placas / Partida" playerValue={+l.platesPerGame.toFixed(1)} baseline={b.plates} color="#FF9F43" />
                </>
            }
            rightContent={
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <LensStatBox label="CS / Min" value={fmt(l.csPerMin)} trend={trend(l.csPerMin, b.cs)} subtext={tierSub(l.csPerMin, b.cs, ' CS/m')} />
                        <LensStatBox label="Oro / Min" value={fmt(l.goldPerMin, 0)} trend={trend(l.goldPerMin, b.goldPerMin)} subtext={tierSub(l.goldPerMin, b.goldPerMin, 'g')} />
                        <LensStatBox label="Placas Tomadas" value={fmt(l.platesPerGame)} trend={trend(l.platesPerGame, b.plates)} />
                    </div>
                    <LensDistribution playerValue={l.csPerMin} baseline={b.cs} label="Distribución CS/Min vs Rango" />
                </>
            }
        />
    );
};

// --- 4. OBJECTIVES TAB ---
export const ObjectivesTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const o = data.objectives;
    const b = TIER_BASELINES[targetTier];

    const objScore = Math.min(100, Math.round(
        ((o.dragonTakedownsPerGame / b.dragonTakedowns) * 40 +
            (o.objectiveDamagePerMin / b.objectiveDmgPerMin) * 30 +
            (o.turretDamagePerGame / b.turretDmg) * 30)
    ));

    return (
        <LensLayout
            leftContent={
                <>
                    <LensStatCard title="Control de Objetivos" subtitle={`VS ${targetTier}`} score={objScore} color="#B07CFF" active />
                    <LensComparisonBar label="Dragones / Partida" playerValue={+o.dragonTakedownsPerGame.toFixed(1)} baseline={b.dragonTakedowns} color="#B07CFF" />
                    <LensComparisonBar label="Daño a Obj / Min" playerValue={Math.round(o.objectiveDamagePerMin)} baseline={b.objectiveDmgPerMin} color="#9F7AEA" />
                    <LensComparisonBar label="Daño a Torres" playerValue={Math.round(o.turretDamagePerGame)} baseline={b.turretDmg} color="#B07CFF" />
                </>
            }
            rightContent={
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <LensStatBox label="Dragones / Partida" value={fmt(o.dragonTakedownsPerGame)} trend={trend(o.dragonTakedownsPerGame, b.dragonTakedowns)} subtext={tierSub(o.dragonTakedownsPerGame, b.dragonTakedowns)} />
                        <LensStatBox label="Daño a Objetivos / Min" value={fmt(o.objectiveDamagePerMin, 0)} trend={trend(o.objectiveDamagePerMin, b.objectiveDmgPerMin)} subtext={tierSub(o.objectiveDamagePerMin, b.objectiveDmgPerMin)} />
                        <LensStatBox label="Daño a Torres" value={fmt(o.turretDamagePerGame, 0)} trend={trend(o.turretDamagePerGame, b.turretDmg)} subtext={tierSub(o.turretDamagePerGame, b.turretDmg)} />
                    </div>
                    <LensDistribution playerValue={o.turretDamagePerGame} baseline={b.turretDmg} label="Distribución Daño a Torres vs Rango" />
                </>
            }
        />
    );
};

// --- 5. VISION TAB ---
export const VisionTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const v = data.vision;
    const b = TIER_BASELINES[targetTier];
    const visMetric = data.metrics.find(m => m.category === 'Vision');

    return (
        <LensLayout
            leftContent={
                <>
                    <LensStatCard title="Control de Visión" subtitle={`VS ${targetTier}`} score={visMetric?.score || 0} color="#4EFFC3" active />
                    <LensComparisonBar label="Visión / Min" playerValue={+v.visionScorePerMin.toFixed(2)} baseline={b.vis} color="#4EFFC3" />
                    <LensComparisonBar label="Wards Puestos" playerValue={+v.wardsPlacedPerGame.toFixed(1)} baseline={b.wardsPlaced} color="#34D399" />
                    <LensComparisonBar label="Wards Destruidos" playerValue={+v.wardsDestroyedPerGame.toFixed(1)} baseline={b.wardsDestroyed} color="#10B981" />
                </>
            }
            rightContent={
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <LensStatBox label="Visión / Min" value={fmt(v.visionScorePerMin, 2)} trend={trend(v.visionScorePerMin, b.vis)} subtext={tierSub(v.visionScorePerMin, b.vis)} />
                        <LensStatBox label="Wards Puestos" value={fmt(v.wardsPlacedPerGame)} trend={trend(v.wardsPlacedPerGame, b.wardsPlaced)} subtext={tierSub(v.wardsPlacedPerGame, b.wardsPlaced)} />
                        <LensStatBox label="Wards Destruidos" value={fmt(v.wardsDestroyedPerGame)} trend={trend(v.wardsDestroyedPerGame, b.wardsDestroyed)} />
                        <LensStatBox label="Control Wards" value={fmt(v.controlWardsPerGame)} trend={trend(v.controlWardsPerGame, b.controlWards)} subtext={tierSub(v.controlWardsPerGame, b.controlWards)} />
                    </div>
                    <LensDistribution playerValue={v.visionScorePerMin} baseline={b.vis} label="Distribución Visión/Min vs Rango" />
                </>
            }
        />
    );
};

// --- 6. SURVIVABILITY TAB ---
export const SurvivabilityTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const s = data.survivability;
    const b = TIER_BASELINES[targetTier];
    const survMetric = data.metrics.find(m => m.category === 'Survivability');

    // For deaths, lower is better — invert the trend logic
    const deathTrend = s.deathsPerGame <= b.deaths ? 'up' : 'down';

    return (
        <LensLayout
            leftContent={
                <>
                    <LensStatCard title="Supervivencia" subtitle={`VS ${targetTier}`} score={survMetric?.score || 0} color="#FF6B6B" active />
                    <LensComparisonBar label="Muertes / Partida" playerValue={+s.deathsPerGame.toFixed(1)} baseline={b.deaths} color="#FF6B6B" />
                    <div className="bg-bg-card border border-border-subtle rounded-xl p-4 space-y-2 text-text-primary">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wide">Tasa de Supervivencia</span>
                            <span className="text-sm font-black text-accent-win">{pct(s.survivalRate)}</span>
                        </div>
                        <p className="text-[9px] text-text-muted opacity-80">Partidas con ≤3 muertes</p>
                    </div>
                </>
            }
            rightContent={
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <LensStatBox label="Muertes / Partida" value={fmt(s.deathsPerGame)} trend={deathTrend} subtext={s.deathsPerGame <= b.deaths ? `▲ Mejor que ${fmt(b.deaths)}` : `▼ Supera ${fmt(b.deaths)}`} />
                        <LensStatBox label="Tasa de Supervivencia" value={pct(s.survivalRate)} trend={s.survivalRate > 0.5 ? 'up' : 'down'} subtext="Partidas con ≤3 muertes" />
                        <LensStatBox label="Cuota de Muertes" value={pct(s.deathShare)} trend={s.deathShare < 0.20 ? 'up' : 'down'} subtext="% de muertes del equipo" />
                    </div>
                    <LensDistribution playerValue={b.deaths - s.deathsPerGame + b.deaths} baseline={b.deaths} label="Distribución Supervivencia vs Rango" />
                </>
            }
        />
    );
};

// --- 7. TEAM IMPACT TAB ---
export const TeamImpactTab = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const t = data.team;
    const b = TIER_BASELINES[targetTier];
    const objMetric = data.metrics.find(m => m.category === 'Objectives'); // uses KP score

    return (
        <LensLayout
            leftContent={
                <>
                    <LensStatCard title="Impacto de Equipo" subtitle={`VS ${targetTier}`} score={objMetric?.score || 0} color="#54A0FF" active />
                    <LensComparisonBar label="Kill Participation" playerValue={+(t.killParticipation * 100).toFixed(1)} baseline={b.kp * 100} unit="%" color="#54A0FF" />
                    <LensComparisonBar label="CC / Partida (seg)" playerValue={Math.round(t.ccTimePerGame)} baseline={b.ccPerGame} color="#818CF8" />
                </>
            }
            rightContent={
                <>
                    <div className="grid grid-cols-3 gap-4">
                        <LensStatBox label="Participación en Kills" value={pct(t.killParticipation)} trend={trend(t.killParticipation, b.kp)} subtext={tierSub(t.killParticipation * 100, b.kp * 100, '%')} />
                        <LensStatBox label="CC / Partida" value={`${Math.round(t.ccTimePerGame)}s`} trend={trend(t.ccTimePerGame, b.ccPerGame)} subtext={tierSub(t.ccTimePerGame, b.ccPerGame, 's')} />
                        <LensStatBox label="Cuota de Daño" value={pct(t.damageShare)} trend={trend(t.damageShare, b.damageShare)} subtext="% del daño del equipo" />
                        <LensStatBox label="Ratio de Asistencias" value={pct(t.assistRatio)} trend={t.assistRatio > 0.5 ? 'up' : 'flat'} subtext="Assists / (Kills + Assists)" />
                    </div>
                    <LensDistribution playerValue={t.killParticipation * 100} baseline={b.kp * 100} label="Distribución KP% vs Rango" />
                </>
            }
        />
    );
};
