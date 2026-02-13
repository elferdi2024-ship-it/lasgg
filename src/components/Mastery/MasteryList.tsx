'use client';

import { useEffect, useState } from 'react';
import { ChampionMastery } from '@/types';
import { useChampions } from '@/hooks/useChampions';
import { Loader2, Trophy, Medal } from 'lucide-react';

export const MasteryList = ({ puuid }: { puuid: string }) => {
    const [mastery, setMastery] = useState<ChampionMastery[]>([]);
    const [loading, setLoading] = useState(true);
    const { getChampionName } = useChampions();

    useEffect(() => {
        const fetchMastery = async () => {
            try {
                const res = await fetch(`/api/mastery/${puuid}`);
                if (res.ok) {
                    const data = await res.json();
                    setMastery(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        if (puuid) fetchMastery();
    }, [puuid]);

    if (loading) return (
        <div className="flex justify-center p-10">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
        </div>
    );

    if (mastery.length === 0) return <div className="text-center text-[var(--text-muted)] p-10">No mastery data found.</div>;

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-8">
            <h3 className="text-xl font-display uppercase tracking-widest text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <Trophy className="text-[var(--accent-primary)]" /> Maestría de Campeones (Top 10)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                {mastery.map((m, i) => (
                    <MasteryCard key={m.championId} mastery={m} rank={i + 1} getChampionName={getChampionName} />
                ))}
            </div>
        </div>
    );
};

const MasteryCard = ({
    mastery,
    rank,
    getChampionName
}: {
    mastery: ChampionMastery,
    rank: number,
    getChampionName: (id: number) => string
}) => {
    const champName = getChampionName(mastery.championId);

    return (
        <div className="bg-[var(--bg-root)] border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden group hover:border-[var(--accent-primary)] transition-colors">
            {/* Rank Badge */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                #{rank}
            </div>

            {/* Image */}
            <div className="relative w-20 h-20 mb-4">
                <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${champName}.png`}
                    alt={champName}
                    className="w-full h-full rounded-full object-cover border-4 border-[var(--bg-card)] shadow-lg group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/29.png' }}
                />
                <div className="absolute -bottom-2 -right-2 bg-[var(--bg-card)] rounded-full p-1">
                    <div className="bg-[var(--accent-primary)] text-[var(--bg-root)] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--bg-root)]">
                        Lvl {mastery.championLevel}
                    </div>
                </div>
            </div>

            {/* Info */}
            <h4 className="font-display font-bold text-[var(--text-primary)] mb-1 truncate w-full">{champName}</h4>
            <p className="text-[var(--text-muted)] text-xs font-mono mb-3">
                {mastery.championPoints.toLocaleString()} PTS
            </p>

            {/* Chest */}
            {mastery.chestGranted && (
                <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                    <Medal size={10} /> Cofre Obtenido
                </div>
            )}
        </div>
    );
}
