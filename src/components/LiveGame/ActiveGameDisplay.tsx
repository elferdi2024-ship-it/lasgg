'use client';

import { ActiveGameInfo, CurrentGameParticipant } from '@/types';
import { useEffect, useState } from 'react';
import { useChampions } from '@/hooks/useChampions';

interface ActiveGameProps {
    game: ActiveGameInfo;
}

export const ActiveGameDisplay = ({ game }: ActiveGameProps) => {
    const { getChampionName, getSpellName, loading: champsLoading } = useChampions();
    const blueTeam = game.participants.filter(p => p.teamId === 100);
    const redTeam = game.participants.filter(p => p.teamId === 200);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Client-side timer
    const [elapsed, setElapsed] = useState(game.gameLength);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (champsLoading) return <div className="text-center p-10">Cargando datos de campeones...</div>;

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display uppercase tracking-widest text-[var(--text-primary)]">
                        Partida en Curso
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm font-mono mt-1">
                        {game.gameMode} • {game.gameType} • {game.mapId === 11 ? "Grieta del Invocador" : "Mapa Desconocido"}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] px-6 py-3 rounded-full">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-xl font-bold tracking-wider">{formatTime(elapsed)}</span>
                </div>
            </div>

            {/* TEAMS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <TeamColumn team={blueTeam} color="blue" getChampionName={getChampionName} getSpellName={getSpellName} />
                <TeamColumn team={redTeam} color="red" getChampionName={getChampionName} getSpellName={getSpellName} />
            </div>
        </div>
    );
};

const TeamColumn = ({
    team,
    color,
    getChampionName,
    getSpellName
}: {
    team: CurrentGameParticipant[],
    color: 'blue' | 'red',
    getChampionName: (id: number) => string,
    getSpellName: (id: number) => string
}) => {
    const isBlue = color === 'blue';
    const borderColor = isBlue ? 'border-cyan-500/30' : 'border-rose-500/30';
    const bgColor = isBlue ? 'bg-cyan-500/5' : 'bg-rose-500/5';
    const titleColor = isBlue ? 'text-cyan-400' : 'text-rose-400';

    return (
        <div className={`rounded-3xl border ${borderColor} ${bgColor} overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${borderColor} flex justify-between items-center`}>
                <h3 className={`font-display uppercase tracking-widest ${titleColor}`}>
                    {isBlue ? 'Equipo Azul' : 'Equipo Rojo'}
                </h3>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
                {team.map((p) => (
                    <PlayerRow key={p.summonerId} player={p} getChampionName={getChampionName} getSpellName={getSpellName} />
                ))}
            </div>
        </div>
    );
};

const PlayerRow = ({
    player,
    getChampionName,
    getSpellName
}: {
    player: CurrentGameParticipant,
    getChampionName: (id: number) => string,
    getSpellName: (id: number) => string
}) => {
    return (
        <div className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
            {/* CHAMPION */}
            <div className="relative">
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${getChampionName(player.championId)}.png`}
                    alt="Champion"
                    className="w-12 h-12 rounded-full border border-[var(--border-subtle)] object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/29.png' }}
                />
                <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                    <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${getSpellName(player.spell1Id)}.png`} className="w-4 h-4 rounded border border-black" />
                    <img src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${getSpellName(player.spell2Id)}.png`} className="w-4 h-4 rounded border border-black" />
                </div>
            </div>

            {/* INFO */}
            <div className="min-w-0 flex-1">
                <p className="font-bold text-[var(--text-primary)] truncate">
                    {player.summonerName} <span className="text-[var(--text-muted)] text-xs font-normal ml-1 hidden">Rank TBD</span>
                </p>
                <div className="flex gap-1 mt-1">
                    {/* Runes (Basic implementation, ideally would map IDs to images) */}
                    <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-root)] px-1.5 rounded border border-[var(--border-subtle)]">
                        Runa: {player.perks.perkStyle}
                    </span>
                </div>
            </div>
        </div>
    );
}
