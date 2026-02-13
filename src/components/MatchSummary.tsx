'use client';

export const MatchSummary = ({ matches, puuid }: { matches: any[], puuid: string }) => {
    if (!matches || matches.length === 0) return null;

    // 1. CÁLCULOS ESTADÍSTICOS
    let wins = 0;
    let kills = 0, deaths = 0, assists = 0;
    const champGroups: any = {};

    matches.forEach((m) => {
        const participants = m.info?.participants || m.participants || [];
        const me = participants.find((p: any) => p.puuid === puuid);
        if (me) {
            if (me.win) wins++;
            kills += me.kills;
            deaths += me.deaths;
            assists += me.assists;

            if (!champGroups[me.championName]) {
                champGroups[me.championName] = { wins: 0, total: 0 };
            }
            champGroups[me.championName].total++;
            if (me.win) champGroups[me.championName].wins++;
        }
    });

    const total = matches.length;
    const losses = total - wins;
    const winrate = Math.round((wins / total) * 100);
    const avgKda = ((kills + assists) / Math.max(1, deaths)).toFixed(2);

    // Obtener top 2 campeones
    const topChamps = Object.entries(champGroups)
        .sort((a: any, b: any) => b[1].total - a[1].total)
        .slice(0, 2);

    return (
        <div className="bg-[var(--bg-card)] rounded-3xl p-8 md:p-10 border border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-4 gap-10 shadow-2xl relative overflow-hidden">

            {/* 1. RECENT WINRATE CIRCLE */}
            <div className="flex items-center gap-8">
                <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90">
                        <circle className="text-[var(--bg-card-soft)]" cx="56" cy="56" fill="transparent" r="50" stroke="currentColor" strokeWidth="8"></circle>
                        <circle style={{ filter: `drop-shadow(0 0 8px var(--accent-primary))` }} className="text-[var(--accent-primary)]" cx="56" cy="56" fill="transparent" r="50" stroke="currentColor" strokeDasharray="314" strokeDashoffset={314 - (winrate * 3.14)} strokeLinecap="round" strokeWidth="8"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-display text-[var(--text-primary)]">{winrate}%</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">WR</span>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-[var(--text-muted)] font-display uppercase tracking-widest mb-1">Últimas 20</p>
                    <p className="text-2xl font-display text-[var(--text-primary)]">{wins}W <span className="text-[var(--accent-loss)]">{losses}L</span></p>
                    <p className="text-xl font-display text-[var(--accent-primary)] mt-1">{avgKda} KDA</p>
                </div>
            </div>

            {/* 2. TOP PERFORMANCE */}
            <div className="flex flex-col justify-center border-l border-[var(--border-subtle)] pl-10">
                <p className="text-[10px] text-[var(--text-muted)] font-display uppercase tracking-widest mb-6">MEJOR RENDIMIENTO</p>
                <div className="flex gap-4">
                    {topChamps.map(([name, stats]: any) => (
                        <div key={name} className="relative group cursor-pointer">
                            <img
                                className="w-14 h-14 rounded-xl border-2 border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors"
                                src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${name}.png`}
                                alt={name}
                            />
                            <span className="absolute -top-2 -right-2 bg-[var(--accent-win)] text-[var(--bg-root)] text-[10px] px-2 py-0.5 rounded-md font-display neon-glow-win">
                                {Math.round((stats.wins / stats.total) * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. FATE PREDICTION */}
            <div className="flex flex-col justify-center border-l border-[var(--border-subtle)] pl-10">
                <p className="text-[10px] text-[var(--text-muted)] font-display uppercase tracking-widest mb-6">PREDICCIÓN DE DESTINO</p>
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center border border-[var(--accent-primary)]/20 shadow-[0_0_15px_var(--neon-primary-glow)]">
                        <span className="material-symbols-outlined text-[var(--accent-primary)] text-2xl fill-1">auto_awesome</span>
                    </div>
                    <div>
                        <p className="text-xl font-display text-[var(--text-primary)] uppercase leading-none">Nivel Sólido</p>
                        <p className="text-xs font-bold text-[var(--text-muted)] mt-2">Top 29% del Rango</p>
                    </div>
                </div>
            </div>

            {/* 4. CLIMB TREND */}
            <div className="flex flex-col justify-center border-l border-[var(--border-subtle)] pl-10">
                <p className="text-[10px] text-[var(--text-muted)] font-display uppercase tracking-widest mb-6">TENDENCIA DE ASCENSO</p>
                <div className="flex items-end gap-2 h-14">
                    {[20, 60, 40, 90, 50, 30, 70].map((h, i) => (
                        <div
                            key={i}
                            className={`w-2.5 rounded-t-sm transition-all ${h > 50 ? 'bg-[var(--accent-win)] neon-glow-win' : h > 30 ? 'bg-[var(--accent-win)]/40' : 'bg-[var(--accent-loss)]/60'}`}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};
