'use client';

import Link from 'next/link';

interface PlayerProps {
    participants: any[];
    teamId: number;
    maxDamage: number;
}

export const TeamTable = ({ participants, teamId, maxDamage }: PlayerProps) => {
    const team = participants.filter((p: any) => p.teamId === teamId);
    if (team.length === 0) return null;
    const isWin = team[0].win;
    const headerColor = isWin ? 'text-[var(--accent-win)]' : 'text-[var(--accent-loss)]';
    const teamName = teamId === 100 ? 'Equipo Azul' : 'Equipo Rojo';

    return (
        <div className="w-full">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-3 px-2 border-b border-[var(--divider)] pb-2">
                <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${headerColor}`}>
                    {isWin ? 'Victoria' : 'Derrota'} ({teamName})
                </span>
                <div className="flex text-[9px] text-[var(--text-muted)] font-black tracking-widest uppercase">
                    <span className="w-[70px] text-center">KDA</span>
                    <span className="w-[90px] text-center">Daño</span>
                    <span className="w-[50px] text-center">CS/VIS</span>
                    <span className="w-[170px] text-right">Objetos</span>
                </div>
            </div>

            {/* Lista de Jugadores */}
            <div className="flex flex-col gap-0.5">
                {team.map((p: any) => (
                    <div
                        key={p.puuid}
                        className="grid grid-cols-[36px_minmax(90px,1.8fr)_70px_90px_50px_170px] items-center gap-2 py-1.5 px-2 rounded-lg border border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--bg-card-soft)] transition-all"
                    >
                        {/* 1. Campeón */}
                        <div className="relative w-9 h-9">
                            <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${p.championName}.png`}
                                alt={p.championName}
                                className="w-full h-full rounded-lg border-2 border-[var(--border-subtle)] object-cover aspect-square"
                            />
                            <div className="absolute -bottom-0.5 -right-1 bg-[var(--bg-card)] text-[8px] text-[var(--text-primary)] px-1 rounded-full border border-[var(--border-subtle)] z-10 font-black">
                                {p.champLevel}
                            </div>
                        </div>

                        {/* 2. Nombre */}
                        <div className="flex flex-col overflow-hidden justify-center pl-1">
                            <Link
                                href={p.riotIdGameName ? `/profile/${p.riotIdGameName}/${p.riotIdTagline}` : '#'}
                                className="text-[12px] font-black truncate hover:text-[var(--accent-primary)] transition-colors text-[var(--text-primary)] leading-tight"
                                title={`${p.riotIdGameName} #${p.riotIdTagline}`}
                            >
                                {p.riotIdGameName || p.summonerName}
                            </Link>
                            <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-tighter leading-tight">
                                {({ TOP: 'Top', JUNGLE: 'Jungla', MIDDLE: 'Mid', BOTTOM: 'ADC', UTILITY: 'Support' } as Record<string, string>)[p.teamPosition || p.individualPosition] || p.teamPosition || ''}
                            </span>

                        </div>

                        {/* 3. KDA */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-[12px] font-black text-[var(--text-primary)] leading-tight">
                                {p.kills}/<span className="text-[var(--accent-loss)]">{p.deaths}</span>/{p.assists}
                            </div>
                            <div className="text-[9px] text-[var(--text-muted)] font-bold leading-tight">
                                {((p.kills + p.assists) / Math.max(1, p.deaths)).toFixed(2)} KDA
                            </div>
                        </div>

                        {/* 4. Daño */}
                        <div className="flex flex-col justify-center w-full">
                            <div className="text-[9px] text-[var(--text-muted)] mb-0.5 font-bold leading-tight">
                                {(p.totalDamageDealtToChampions / 1000).toFixed(1)}k
                            </div>
                            <div className="h-1.5 w-full bg-[var(--bg-card-soft)] rounded-full overflow-hidden border border-[var(--border-subtle)]/50">
                                <div
                                    className={`h-full rounded-full ${isWin ? 'bg-[var(--accent-win)]' : 'bg-[var(--accent-loss)]'}`}
                                    style={{ width: `${(p.totalDamageDealtToChampions / maxDamage) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* 5. CS y Visión */}
                        <div className="flex flex-col items-center justify-center text-[9px] text-[var(--text-muted)] font-bold leading-tight gap-0.5">
                            <span>{p.totalMinionsKilled}</span>
                            <span className="opacity-50">{p.visionScore}</span>
                        </div>

                        {/* 6. ITEMS */}
                        <div className="flex justify-end gap-1">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                p[`item${i}`] ? (
                                    <img
                                        key={i}
                                        src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${p[`item${i}`]}.png`}
                                        className="w-[26px] h-[26px] rounded-md border border-[var(--border-subtle)] bg-black/20 hover:scale-110 hover:z-10 transition-transform object-cover aspect-square"
                                        alt="Item"
                                    />
                                ) : (
                                    <div key={i} className="w-[26px] h-[26px] rounded-md bg-[var(--bg-page)] border border-[var(--border-subtle)]" />
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
