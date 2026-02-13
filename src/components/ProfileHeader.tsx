'use client';

// Diccionario de colores para los tags
const TAG_STYLES: Record<string, string> = {
    'DAMAGE_DEMON': 'text-rose-400 border-rose-400/30 bg-rose-400/10',
    'VISION_GOD': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    'FARM_MACHINE': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    'STABLE_PERFORMER': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    'DUELIST': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    'FRAGILE': 'text-rose-500 border-rose-500/30 bg-rose-500/10',
    'PASSIVE': 'text-slate-400 border-slate-400/30 bg-slate-400/10',
};

import { SummonerProfileData } from '@/types';

export const ProfileHeader = ({ data, onUpdate }: { data: SummonerProfileData, onUpdate?: () => void }) => {
    // Buscamos el campeón más usado para el fondo
    const participants = data.matches?.[0]?.info?.participants || [];
    const me = participants.find((p: any) => p.puuid === data.profile?.puuid);
    const bgChamp = me?.championName || 'Aatrox';

    const tags = data.tags || [];

    // Winrate Global (calculado de la liga real)
    let wins = data.rank?.solo?.wins || 0;
    let losses = data.rank?.solo?.losses || 0;
    let isMatchHistoryWR = false;

    // Fallback: Si no hay datos de liga, usamos el winrate de las partidas descargadas
    if (wins === 0 && losses === 0 && (data.matches?.length || 0) > 0) {
        data.matches?.forEach((m: any) => {
            const participantsMatch = m.info?.participants || m.participants || [];
            const meMatch = participantsMatch.find((p: any) => p.puuid === data.profile?.puuid);
            if (meMatch) {
                if (meMatch.win) wins++;
                else losses++;
            }
        });
        isMatchHistoryWR = true;
    }

    const total = wins + losses;
    const wr = total > 0 ? ((wins / total) * 100).toFixed(0) : 0;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] mb-12 shadow-2xl group">
            {/* 1. CINEMATIC BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-root)] via-[var(--bg-root)]/80 to-transparent z-10" />
            <img
                alt="League Art"
                className="w-full h-80 object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bgChamp}_0.jpg`}
            />

            {/* 2. CONTENT OVERLAY */}
            <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

                {/* Profile Identity */}
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative shrink-0">
                        <img
                            alt="Profile Icon"
                            className="w-40 h-40 rounded-2xl border-4 border-[var(--border-subtle)] shadow-2xl object-cover aspect-square"
                            src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${data.profile.profileIconId}.png`}
                        />
                        <div className="absolute -bottom-3 -right-3 bg-[var(--accent-primary)] text-[var(--bg-root)] font-display px-4 py-1.5 rounded-lg border-2 border-[var(--bg-root)] shadow-2xl text-lg">
                            {data.profile.summonerLevel}
                        </div>
                    </div>

                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <h1 className="text-4xl md:text-6xl font-display text-[var(--text-primary)] uppercase leading-none tracking-tighter">
                                {data.profile.gameName} <span className="text-[var(--text-primary)]/30 text-2xl md:text-4xl">#{data.profile.tagLine}</span>
                            </h1>
                            <span className="material-symbols-outlined text-[var(--accent-primary)] text-4xl fill-1 drop-shadow-[0_0_15px_var(--neon-primary-glow)] hidden md:block">star</span>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 max-w-xl">
                            {tags.map((tag: any, i: number) => {
                                const style = TAG_STYLES[tag.label] || 'text-slate-400 border-slate-400/30 bg-slate-400/10';
                                return (
                                    <div key={i} className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${style}`}>
                                        {tag.label.replace('_', ' ')}
                                    </div>
                                );
                            })}
                            <span className="px-4 py-1.5 bg-[var(--overlay-bg)] text-[var(--text-secondary)] text-[10px] font-black rounded-lg border border-[var(--border-subtle)] uppercase tracking-[0.2em]">Región LAS</span>
                        </div>

                        <p className="text-xs text-[var(--text-muted)] font-semibold tracking-wide uppercase opacity-70">
                            Rendimiento en Clasificatorias • Actualizado ahora
                        </p>
                    </div>
                </div>

                {/* Quick Stats Overlay (Right Side) */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-[var(--overlay-bg)] rounded-2xl p-6 md:p-8 border border-[var(--border-subtle)] backdrop-blur-md">
                    <div className="text-center px-4">
                        <p className="text-[10px] text-[var(--text-muted)] font-display uppercase tracking-[0.2em] mb-1">
                            {isMatchHistoryWR ? 'Winrate Reciente' : 'Winrate Temporada'}
                        </p>
                        <p className={`text-4xl md:text-5xl font-display ${Number(wr) >= 50 ? 'text-[var(--accent-win)]' : Number(wr) >= 45 ? 'text-[var(--accent-primary)]' : 'text-[var(--accent-loss)]'}`}>{wr}%</p>
                    </div>

                    <div className="hidden md:block w-px h-16 bg-[var(--border-subtle)]" />

                    <div className="text-center px-4">
                        <p className="text-[10px] text-[var(--text-muted)] font-display uppercase tracking-[0.2em] mb-1">
                            {isMatchHistoryWR ? 'Balance (15G)' : 'Balance Temp.'}
                        </p>
                        <p className="text-4xl md:text-5xl font-display text-[var(--text-primary)]">{wins}W <span className="text-[var(--text-primary)]/20">-</span> {losses}L</p>
                    </div>
                </div>

                <div className="md:ml-6">
                    <button
                        onClick={onUpdate}
                        disabled={!onUpdate}
                        className="bg-[var(--accent-primary)] hover:scale-105 active:scale-95 text-[var(--bg-root)] px-8 md:px-10 py-3 md:py-4 rounded-xl font-display text-lg md:text-xl transition-all neon-glow-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="material-symbols-outlined text-2xl font-bold">refresh</span>
                        ACTUALIZAR
                    </button>
                </div>
            </div>
        </div>
    );
};
