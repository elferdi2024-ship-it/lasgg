'use client';

import { TeamTable } from './TeamTable';
import { motion } from 'framer-motion';
import { GameCoach } from './GameCoach';
import { Sparkles } from 'lucide-react';

export const MatchDetail = ({ match, puuid }: { match: any, puuid: string }) => {
    const participants = match.info?.participants || match.participants || [];
    const maxDamage = Math.max(...participants.map((p: any) => p.totalDamageDealtToChampions || 0), 1);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative overflow-hidden"
        >
            {/* Background: subtle gradient depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-page) 100%)',
                    opacity: 0.8
                }}
            />
            {/* Subtle radial glow at top center */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, var(--accent-primary), transparent 70%)',
                    opacity: 0.04,
                }}
            />

            <div className="relative z-10 p-4 md:p-5">

                {/* ═══ TEAM TABLES ═══ */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4 xl:gap-0">
                    {/* Blue team */}
                    <div className="xl:pr-4">
                        <TeamTable participants={participants} teamId={100} maxDamage={maxDamage} />
                    </div>

                    {/* Decorative vertical divider (xl only) */}
                    <div className="hidden xl:flex flex-col items-center py-4">
                        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/30 to-transparent" />
                        <div className="my-3">
                            <div
                                className="w-2 h-2 rounded-full bg-[var(--accent-primary)]/60 animate-pulse"
                                style={{ boxShadow: '0 0 10px var(--neon-primary-glow)' }}
                            />
                        </div>
                        <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/30 to-transparent" />
                    </div>

                    {/* Horizontal divider (mobile/tablet) */}
                    <div className="xl:hidden flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
                        <span className="text-[9px] text-[var(--text-muted)] font-black tracking-[0.3em] uppercase">VS</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
                    </div>

                    {/* Red team */}
                    <div className="xl:pl-4">
                        <TeamTable participants={participants} teamId={200} maxDamage={maxDamage} />
                    </div>
                </div>

                {/* ═══ AI COACH ═══ */}
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] relative">
                    {/* Decorative glow line on the border */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)',
                        }}
                    />
                    <GameCoach match={match} puuid={puuid} />
                </div>

                {/* ═══ DECORATIVE FOOTER ═══ */}
                <div className="mt-3 flex justify-center pb-1">
                    <button className="group flex items-center gap-4 text-[10px] uppercase font-black tracking-[0.3em] text-[var(--text-muted)]/40 hover:text-[var(--accent-primary)]/60 transition-all duration-300">
                        <span className="w-8 h-px bg-current group-hover:w-14 transition-all duration-300" />
                        <span className="flex items-center gap-2">
                            <Sparkles size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            Timeline Avanzado & Build Path
                            <Sparkles size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="w-8 h-px bg-current group-hover:w-14 transition-all duration-300" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
