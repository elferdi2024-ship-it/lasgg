'use client';
import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { MatchDetail } from './MatchDetail';

// Spell ID → Name mapping
const SPELL_MAP: Record<number, string> = {
    1: 'SummonerBoost', 3: 'SummonerExhaust', 4: 'SummonerFlash', 6: 'SummonerHaste',
    7: 'SummonerHeal', 11: 'SummonerSmite', 12: 'SummonerTeleport', 14: 'SummonerDot',
    21: 'SummonerBarrier', 32: 'SummonerSnowball',
};

// Queue ID → Display name
const QUEUE_MAP: Record<number, string> = {
    420: 'Solo/Duo', 440: 'Flex', 450: 'ARAM', 400: 'Normal',
    430: 'Normal', 490: 'Quickplay', 0: 'Custom',
};

// Time ago helper
function timeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

// Deterministic AI-Score
function computeAIScore(me: any, match: any): number {
    const durationMin = (match.info?.gameDuration || 1) / 60;
    const kda = (me.kills + me.assists) / Math.max(1, me.deaths);
    const cs = (me.totalMinionsKilled || 0) + (me.neutralMinionsKilled || 0);
    const csMin = cs / Math.max(1, durationMin);
    const dpm = me.challenges?.damagePerMinute || (me.totalDamageDealtToChampions / Math.max(1, durationMin));
    const visionPerMin = me.challenges?.visionScorePerMinute || ((me.visionScore || 0) / Math.max(1, durationMin));
    const kp = me.challenges?.killParticipation || 0;

    const kdaScore = Math.min(100, (kda / 4.0) * 100);
    const csScore = Math.min(100, (csMin / 8.0) * 100);
    const dpmScore = Math.min(100, (dpm / 800) * 100);
    const visionScoreVal = Math.min(100, (visionPerMin / 1.5) * 100);
    const kpScore = Math.min(100, (kp / 0.65) * 100);

    const weighted = (kdaScore * 0.30) + (dpmScore * 0.25) + (csScore * 0.20) + (kpScore * 0.15) + (visionScoreVal * 0.10);
    return Math.max(0, Math.min(100, Math.round(weighted)));
}

// Mini circular score ring
const ScoreRing = ({ score, size = 44 }: { score: number; size?: number }) => {
    const radius = (size / 2) - 4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? 'var(--accent-win)' : score >= 50 ? 'var(--accent-primary)' : 'var(--accent-loss)';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--bg-card)" strokeWidth="3" fill="transparent" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth="3" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
            </svg>
            <span className="absolute text-sm font-black" style={{ color }}>{score}</span>
        </div>
    );
};

export const MatchCard = ({ match, puuid }: { match: any, puuid: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const me = match.info?.participants?.find((p: any) => p.puuid === puuid) ||
        match.participants?.find((p: any) => p.puuid === puuid);

    if (!me) return null;

    const isWin = me.win;
    const aiScore = useMemo(() => computeAIScore(me, match), [me, match]);
    const durationSec = match.info?.gameDuration || 0;
    const durationStr = `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2, '0')}`;
    const agoStr = match.info?.gameCreation ? timeAgo(match.info.gameCreation) : '';
    const queueName = QUEUE_MAP[match.info?.queueId] || match.info?.gameMode || 'Ranked';
    const kda = ((me.kills + me.assists) / Math.max(1, me.deaths)).toFixed(1);

    const spell1 = SPELL_MAP[me.summoner1Id] || 'SummonerFlash';
    const spell2 = SPELL_MAP[me.summoner2Id] || 'SummonerFlash';

    // Find lane opponent (same lane, opposite team)
    const myTeamId = me.teamId;
    const myLane = me.individualPosition || me.teamPosition || me.lane || '';
    const opponent = match.info?.participants?.find((p: any) =>
        p.teamId !== myTeamId && (p.individualPosition === myLane || p.teamPosition === myLane)
    );

    // Items (0-5 main, 6 is trinket)
    const items = [0, 1, 2, 3, 4, 5].map(i => me[`item${i}`]).filter(Boolean);

    return (
        <div className={`w-full rounded-lg overflow-hidden transition-all duration-200 hover:brightness-110 ${isWin ? 'bg-[var(--match-win-bg)]' : 'bg-[var(--match-loss-bg)]'}`}>

            {/* === COMPACT ROW === */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex flex-col md:flex-row items-start md:items-center gap-0 cursor-pointer relative border-l-4 ${isWin ? 'border-[var(--match-win-border)]' : 'border-[var(--match-loss-border)]'}`}
            >

                {/* 1. META: Duration + Time Ago + Queue */}
                <div className="w-full md:w-[130px] shrink-0 px-4 py-2 md:py-4 border-b md:border-b-0 md:border-r border-[var(--border-subtle)] flex md:flex-col justify-between items-center md:items-start bg-white/5 md:bg-transparent">
                    <div className="flex items-center gap-2 order-2 md:order-1">
                        <span className="text-sm md:text-base font-bold text-[var(--text-primary)]">{durationStr}</span>
                        <span className="text-xs md:text-sm text-[var(--text-muted)]">{agoStr}</span>
                    </div>
                    <p className={`text-sm font-bold order-1 md:order-2 ${isWin ? 'text-[var(--match-win-border)]' : 'text-[var(--match-loss-border)]'}`}>{queueName}</p>
                </div>

                {/* MAIN CONTENT CONTAINER (Desktop: linear, Mobile: Grid) */}
                <div className="flex flex-1 flex-col md:flex-row items-center w-full">

                    {/* 2. CHAMPION + SPELLS */}
                    <div className="flex items-center gap-3 px-4 py-3 shrink-0 w-full md:w-auto justify-start border-b md:border-b-0 border-white/5 md:border-none">
                        <img
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 ${isWin ? 'border-[var(--match-win-border)]/40' : 'border-[var(--match-loss-border)]/40'} object-cover aspect-square`}
                            src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${me.championName}.png`}
                            alt={me.championName}
                        />
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${spell1}.png`}
                                    className="w-5 h-5 md:w-6 md:h-6 rounded-md border border-[var(--border-subtle)]" alt="spell" />
                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${spell2}.png`}
                                    className="w-5 h-5 md:w-6 md:h-6 rounded-md border border-[var(--border-subtle)]" alt="spell" />
                            </div>
                        </div>

                        {/* Mobile KDA (Inline with champ) */}
                        <div className="flex md:hidden flex-col ml-auto text-right">
                            <div className="text-lg font-black text-[var(--text-primary)]">
                                {me.kills}<span className="text-[var(--text-muted)]">/</span><span className="text-[var(--accent-loss)]">{me.deaths}</span><span className="text-[var(--text-muted)]">/</span>{me.assists}
                            </div>
                            <div className={`text-xs font-bold ${parseFloat(kda) >= 3 ? 'text-[var(--accent-win)]' : parseFloat(kda) >= 2 ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                {kda} KDA
                            </div>
                        </div>
                    </div>

                    {/* 3. KDA (Desktop Only) */}
                    <div className="hidden md:block w-[180px] shrink-0 px-4">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-[var(--text-primary)]">{me.kills}</span>
                            <span className="text-lg text-[var(--text-muted)] font-bold">/</span>
                            <span className="text-2xl font-black text-[var(--accent-loss)]">{me.deaths}</span>
                            <span className="text-lg text-[var(--text-muted)] font-bold">/</span>
                            <span className="text-2xl font-black text-[var(--text-primary)]">{me.assists}</span>
                        </div>
                        <div className={`text-sm font-bold mt-1 ${parseFloat(kda) >= 3 ? 'text-[var(--accent-win)]' : parseFloat(kda) >= 2 ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                            {kda} <span className="text-xs text-[var(--text-muted)]">KDA</span>
                        </div>
                    </div>

                    {/* 4. ITEMS */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-1.5 px-4 py-2 shrink-0 md:border-none border-b border-white/5 w-full md:w-auto">
                        {items.map((itemId, i) => (
                            <img
                                key={i}
                                src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${itemId}.png`}
                                className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--overlay-bg)]"
                                alt="item"
                            />
                        ))}
                        {/* Fill empty slots (Desktop mainly, or mobile if space) */}
                        {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-[var(--border-subtle)]/30 bg-[var(--overlay-bg)] hidden md:block" />
                        ))}
                        {/* Trinket */}
                        {me.item6 ? (
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${me.item6}.png`}
                                className="w-8 h-8 rounded-lg border border-yellow-500/20 bg-[var(--overlay-bg)] ml-auto md:ml-1"
                                alt="trinket"
                            />
                        ) : <div className="w-8 h-8 rounded-lg border border-[var(--border-subtle)]/30 bg-[var(--overlay-bg)] ml-auto md:ml-1 hidden md:block" />}
                    </div>

                    {/* 5. VS MATCHUP & SCORE */}
                    <div className="flex items-center px-4 py-2 w-full md:w-auto justify-between md:justify-end ml-auto gap-4">
                        {/* VS (Mobile only here, desktop has its own col? No, shared in layout) */}
                        {opponent ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--text-muted)] font-bold uppercase">vs</span>
                                <img
                                    className="w-10 h-10 md:w-11 md:h-11 rounded-xl border border-[var(--border-subtle)] grayscale-[0.3]"
                                    src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${opponent.championName}.png`}
                                    alt={opponent.championName}
                                />
                            </div>
                        ) : (
                            <div className="w-10 md:w-14" />
                        )}

                        {/* 6. AI SCORE RING */}
                        <div className="flex items-center gap-3">
                            <ScoreRing score={aiScore} size={48} />
                            <ChevronDown
                                size={20}
                                className={`text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* === EXPANDED DETAIL === */}
            {isOpen && (
                <div className="border-t border-white/[0.06] animate-in slide-in-from-top-2 duration-300" style={{ background: 'linear-gradient(180deg, rgba(10,10,14,0.95) 0%, rgba(14,14,18,0.98) 100%)' }}>
                    <MatchDetail match={match} puuid={puuid} />
                </div>
            )}
        </div>
    );
};
