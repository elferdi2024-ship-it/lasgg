'use client';

import { useState } from 'react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

export const GameCoach = ({ match, puuid }: { match: any, puuid: string }) => {
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);

    // Extraer datos relevantes para no saturar a la IA
    const me = match.info?.participants?.find((p: any) => p.puuid === puuid) ||
        match.participants?.find((p: any) => p.puuid === puuid);

    const getAdvice = async () => {
        if (!me) return;
        setLoading(true);
        try {
            const gameDurationMinutes = (match.info?.gameDuration || match.gameDuration) / 60;

            // Preparamos datos ligeros para enviar
            const stats = {
                csPerMin: (me.totalMinionsKilled / gameDurationMinutes).toFixed(1),
                vision: me.visionScore,
                damage: me.totalDamageDealtToChampions,
                gold: me.goldEarned,
                items: [me.item0, me.item1, me.item2, me.item3, me.item4, me.item5],
                matchDuration: gameDurationMinutes.toFixed(0)
            };

            const res = await fetch('/api/coach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matchData: stats,
                    champion: me.championName,
                    role: me.teamPosition,
                    win: me.win,
                    kda: `${me.kills}/${me.deaths}/${me.assists}`
                })
            });

            const data = await res.json();
            if (data.error) {
                setAdvice(data.error);
            } else {
                setAdvice(data.advice);
            }
        } catch (e) {
            setAdvice("Error conectando con el servidor de análisis.");
        } finally {
            setLoading(false);
        }
    };

    if (!me) return null;

    return (
        <div className="mt-4 border-t border-[var(--divider)] pt-4">
            {!advice && !loading && (
                <button
                    onClick={getAdvice}
                    className="group relative flex items-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 hover:bg-purple-500/15 hover:border-purple-500/30 transition-all w-full justify-center overflow-hidden shadow-sm"
                >
                    <Bot size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Solicitar Análisis IA</span>
                    <Sparkles size={14} className="text-purple-400 animate-pulse" />

                    {/* Subtle Glow */}
                    <div className="absolute inset-0 bg-[var(--bg-card)] opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center gap-3 py-6 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                    <div className="relative">
                        <Loader2 size={24} className="animate-spin text-purple-500" />
                        <Sparkles size={12} className="absolute -top-1 -right-1 text-purple-300 animate-bounce" />
                    </div>
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest animate-pulse">
                        Consultando al Coach Challenger...
                    </span>
                </div>
            )}

            {advice && (
                <div className="bg-gradient-to-br from-purple-500/10 to-[var(--bg-card)] border border-purple-500/20 rounded-xl p-5 relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-400 to-purple-600" />

                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-purple-600/10 rounded-2xl border border-purple-500/20 shadow-sm">
                            <Bot size={22} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Análisis del Coach</h4>
                                <div className="h-[1px] flex-1 bg-purple-500/20" />
                            </div>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed font-bold">
                                {advice}
                            </p>
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12">
                        <Sparkles size={100} className="text-purple-300" />
                    </div>
                </div>
            )}
        </div>
    );
};
