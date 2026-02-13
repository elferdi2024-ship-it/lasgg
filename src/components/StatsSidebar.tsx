'use client';

import { useMemo } from 'react';
import { Swords, Shield, Crosshair, Wand2, TreeDeciduous } from 'lucide-react';
import { SummonerProfileData } from '@/types';

// Rank icons
const RANK_ICONS: Record<string, string> = {
    'UNRANKED': '/ranks/Season_2026_-_Unranked.png',
    'IRON': '/ranks/Season_2026_-_Iron.png',
    'BRONZE': '/ranks/Season_2026_-_Bronze.png',
    'SILVER': '/ranks/Season_2026_-_Silver.png',
    'GOLD': '/ranks/Season_2026_-_Gold.png',
    'PLATINUM': '/ranks/Season_2026_-_Platinum.png',
    'EMERALD': '/ranks/Season_2026_-_Emerald.png',
    'DIAMOND': '/ranks/Season_2026_-_Diamond.png',
    'MASTER': '/ranks/Season_2026_-_Master.png',
    'GRANDMASTER': '/ranks/Season_2026_-_Grandmaster.png',
    'CHALLENGER': '/ranks/Season_2026_-_Challenger.png',
};

// Role icons
const ROLE_ICONS: Record<string, any> = {
    'TOP': TreeDeciduous,
    'JUNGLE': TreeDeciduous,
    'MIDDLE': Wand2,
    'BOTTOM': Crosshair,
    'UTILITY': Shield,
    'ADC': Crosshair,
    'SUPPORT': Shield,
    'MID': Wand2,
};

const ROLE_LABELS: Record<string, string> = {
    'TOP': 'TOP',
    'JUNGLE': 'JUNGLE',
    'MIDDLE': 'MID',
    'BOTTOM': 'ADC',
    'UTILITY': 'SUPPORT',
};

export const StatsSidebar = ({ data }: { data: SummonerProfileData }) => {
    const league = data.rank?.solo || {
        wins: 0,
        losses: 0,
        tier: 'UNRANKED',
        rank: '',
        leaguePoints: 0
    };
    const tier = (league.tier || 'UNRANKED').toUpperCase();
    const rank = league.rank || '';
    const lp = league.leaguePoints || 0;
    const matches = data.matches || [];

    let wins = league.wins || 0;
    let losses = league.losses || 0;

    if (wins === 0 && losses === 0 && matches.length > 0) {
        matches.forEach((m: any) => {
            const meMatch = (m.info?.participants || m.participants || []).find((p: any) => p.puuid === data.profile?.puuid);
            if (meMatch) {
                if (meMatch.win) wins++;
                else losses++;
            }
        });
    }

    const totalGames = wins + losses;
    const winrate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    const tierIcon = RANK_ICONS[tier] || RANK_ICONS['UNRANKED'];

    // Calculate champion stats
    const { topChamps, roleStats } = useMemo(() => {
        const champMap: Record<string, { count: number; wins: number; kills: number; deaths: number; assists: number }> = {};
        const roleMap: Record<string, { count: number; wins: number }> = {};

        matches.forEach((m) => {
            const participants = m.info?.participants || [];
            const p = participants.find((sub: any) => sub.puuid === data.profile?.puuid);
            if (!p) return;

            // Champions
            if (!champMap[p.championName]) {
                champMap[p.championName] = { count: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
            }
            champMap[p.championName].count++;
            if (p.win) champMap[p.championName].wins++;
            champMap[p.championName].kills += p.kills;
            champMap[p.championName].deaths += p.deaths;
            champMap[p.championName].assists += p.assists;

            // Roles
            const role = p.individualPosition || p.teamPosition || 'UNKNOWN';
            if (role && role !== 'UNKNOWN' && role !== 'Invalid') {
                if (!roleMap[role]) roleMap[role] = { count: 0, wins: 0 };
                roleMap[role].count++;
                if (p.win) roleMap[role].wins++;
            }
        });

        const topChamps = Object.entries(champMap)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 6);

        const roleStats = Object.entries(roleMap)
            .sort(([, a], [, b]) => b.count - a.count);

        return { topChamps, roleStats };
    }, [matches, data.profile?.puuid]);

    return (
        <aside className="space-y-4">

            {/* ═══ RANK CARD ═══ */}
            <div className="bg-[var(--sidebar-card-bg)] rounded-xl border border-[var(--border-subtle)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Rango Solo/Dúo</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tier === 'UNRANKED' ? 'text-[var(--text-muted)] bg-[var(--bg-card-soft)]' : 'text-[var(--accent-win)] bg-[var(--accent-win)]/10'}`}>
                        {tier === 'UNRANKED' ? 'SIN RANGO' : 'ACTIVO'}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-[var(--overlay-bg)] rounded-xl flex items-center justify-center border border-[var(--border-subtle)]">
                        <img src={tierIcon} alt={tier} className="w-14 h-14 object-contain" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">
                            {tier} <span className="text-[var(--text-primary)]/30">{rank}</span>
                        </h3>
                        <p className="text-sm font-bold text-[var(--accent-primary)] mt-1">{lp} LP</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex justify-between items-center mb-2 text-xs font-bold">
                        <span className="text-[var(--text-muted)]">{totalGames} Partidas</span>
                        <span className={winrate >= 50 ? 'text-[var(--accent-win)]' : 'text-[var(--accent-loss)]'}>
                            {winrate}% WR
                        </span>
                    </div>
                    <div className="w-full h-2 bg-[var(--overlay-bg)] rounded-full overflow-hidden flex">
                        <div className="h-full bg-[var(--match-win-border)] rounded-l-full" style={{ width: `${winrate}%` }} />
                        <div className="h-full bg-[var(--match-loss-border)] rounded-r-full" style={{ width: `${100 - winrate}%` }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[11px] font-bold text-[var(--text-muted)]">
                        <span>{wins}W</span>
                        <span>{losses}L</span>
                    </div>
                </div>
            </div>

            {/* ═══ CHAMPION PERFORMANCE ═══ */}
            <div className="bg-[var(--sidebar-card-bg)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2">
                    <Swords size={16} className="text-[var(--text-muted)]" />
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Rendimiento del campeón</h4>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[44px_1fr_70px_50px] gap-2 px-5 py-2.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                    <span></span>
                    <span>KDA</span>
                    <span className="text-center">Partidas</span>
                    <span className="text-right">WR</span>
                </div>

                {/* Champion Rows */}
                <div className="divide-y divide-[var(--divider)]">
                    {topChamps.map(([name, stats]: [string, any]) => {
                        const wr = Math.round((stats.wins / stats.count) * 100);
                        const avgKda = ((stats.kills + stats.assists) / Math.max(1, stats.deaths)).toFixed(1);
                        const avgK = (stats.kills / stats.count).toFixed(1);
                        const avgD = (stats.deaths / stats.count).toFixed(1);
                        const avgA = (stats.assists / stats.count).toFixed(1);

                        return (
                            <div key={name} className="grid grid-cols-[44px_1fr_70px_50px] gap-2 items-center px-5 py-3 hover:bg-[var(--bg-card-soft)] transition-colors cursor-pointer group">
                                {/* Champion Icon */}
                                <img
                                    className="w-10 h-10 rounded-lg border border-[var(--border-subtle)] group-hover:scale-105 transition-transform object-cover aspect-square"
                                    src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${name}.png`}
                                    alt={name}
                                />

                                {/* KDA */}
                                <div>
                                    <p className="text-lg font-black text-[var(--text-primary)] leading-tight">{avgKda}</p>
                                    <p className="text-[11px] text-[var(--text-muted)] font-medium">{avgK} / {avgD} / {avgA}</p>
                                </div>

                                {/* Games */}
                                <p className="text-lg font-black text-[var(--text-primary)] text-center">{stats.count}</p>

                                {/* WR */}
                                <p className={`text-base font-black text-right ${wr >= 60 ? 'text-[var(--accent-win)]' : wr >= 50 ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-loss)]'}`}>
                                    {wr}%
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Show all button */}
                <button className="w-full py-3.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-soft)] transition-all border-t border-[var(--border-subtle)] uppercase tracking-wider flex items-center justify-center gap-2">
                    <span>≡</span> TODOS
                </button>
            </div>

            {/* ═══ ROLE PERFORMANCE ═══ */}
            <div className="bg-[var(--sidebar-card-bg)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center gap-2">
                    <Shield size={16} className="text-[var(--text-muted)]" />
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Rendimiento por rol</h4>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[28px_1fr_70px_50px] gap-2 px-5 py-2.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                    <span></span>
                    <span>Rol</span>
                    <span className="text-center">Partidas</span>
                    <span className="text-right">WR</span>
                </div>

                {/* Role Rows */}
                <div className="divide-y divide-[var(--divider)]">
                    {roleStats.map(([role, stats]) => {
                        const wr = Math.round((stats.wins / stats.count) * 100);
                        const displayName = ROLE_LABELS[role] || role;
                        const RoleIcon = ROLE_ICONS[role] || ROLE_ICONS[displayName] || Swords;

                        return (
                            <div key={role} className="grid grid-cols-[28px_1fr_70px_50px] gap-2 items-center px-5 py-3 hover:bg-[var(--bg-card-soft)] transition-colors">
                                {/* Role Icon */}
                                <RoleIcon size={18} className="text-[var(--text-muted)]" />

                                {/* Role Name */}
                                <p className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">{displayName}</p>

                                {/* Games */}
                                <p className="text-lg font-black text-[var(--text-primary)] text-center">{stats.count}</p>

                                {/* WR */}
                                <p className={`text-base font-black text-right ${wr >= 60 ? 'text-[var(--accent-win)]' : wr >= 50 ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-loss)]'}`}>
                                    {wr}%
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
