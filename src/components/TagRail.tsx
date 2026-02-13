'use client';

import { useState } from 'react';
import { Zap, Eye, Crosshair, Skull, Shield, Target, Map, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapeo de etiquetas con estética DeepLOL
const TAG_CONFIG: any = {
    // STRENGTHS (Fortalezas)
    LANE_BULLY: { label: 'Acosador de Línea', icon: Zap, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 neon-glow-win' },
    DAMAGE_DEMON: { label: 'Demonio del Daño', icon: Skull, color: 'text-red-400 border-red-500/30 bg-red-500/10 neon-glow-loss' },
    UNSTOPPABLE: { label: 'Imparable', icon: Zap, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
    DUELIST: { label: 'Duelista Élite', icon: Crosshair, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    VISION_GOD: { label: 'Dios de la Visión', icon: Eye, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    OBJECTIVE_KING: { label: 'Rey de Objetivos', icon: Target, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    STRUCTURE_DESTROYER: { label: 'Demoledor de Torres', icon: Shield, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
    MAP_HACKER: { label: 'Maestro del Mapa', icon: Map, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    FARM_MACHINE: { label: 'Máquina de Farm', icon: Crosshair, color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
    GOLD_HYPERCAR: { label: 'Motor de Oro', icon: Zap, color: 'text-yellow-500 border-yellow-600/30 bg-yellow-600/10' },
    STABLE_PERFORMER: { label: 'Muralla de Consistencia', icon: Shield, color: 'text-slate-400 border-slate-500/30 bg-slate-500/10' },
    KDA_PLAYER: { label: 'Jugador de KDA', icon: Skull, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },

    // NEW TAGS (Team & Strategy)
    TEAM_PLAYER: { label: 'Jugador de Equipo', icon: Users, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    SOLO_CARRY: { label: 'Lobo Solitario', icon: Zap, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    SAFE_PLAYER: { label: 'Juego Seguro', icon: Shield, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    RISKY_PLAYER: { label: 'Arriesgado', icon: AlertTriangle, color: 'text-rose-500 border-rose-500/30 bg-rose-500/10' },
    OBJECTIVE_BLIND: { label: 'Ciego de Objetivos', icon: Target, color: 'text-slate-500 border-slate-500/30 bg-slate-500/10' },

    // WEAKNESSES (Debilidades)
    FRAGILE: { label: 'Frágil', icon: Skull, color: 'text-rose-500 border-rose-500/30 bg-rose-500/5 animate-pulse' },
    VISION_BLIND: { label: 'Ciego de Visión', icon: Eye, color: 'text-slate-500 border-slate-500/30 bg-slate-500/5 shadow-inner' },
    FARM_DRY: { label: 'Sequía de Farm', icon: Crosshair, color: 'text-orange-600 border-orange-600/30 bg-orange-600/5' },
    PASSIVE: { label: 'Pasivo', icon: Zap, color: 'text-zinc-500 border-zinc-500/30 bg-zinc-500/5' },
    LOW_IMPACT: { label: 'Bajo Impacto', icon: Target, color: 'text-gray-500 border-gray-500/30 bg-gray-500/5 opacity-70' },
};

export const TagRail = ({ tags }: { tags: any[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2.5 relative">
            {tags.map((tag, i) => {
                const config = TAG_CONFIG[tag.label] || { label: tag.label, icon: Zap, color: 'text-gray-400 border-gray-600' };
                const Icon = config.icon;
                const isHovered = hoveredIndex === i;

                return (
                    <div
                        key={tag.id || i}
                        className="relative"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-xl border leading-none
                                ${config.color} cursor-help transition-all hover:scale-110 active:scale-95
                                ${isHovered ? 'z-50' : 'z-10'}
                            `}
                        >
                            <Icon size={14} className="opacity-80" />
                            <span className="font-bold text-[11px] uppercase tracking-wider">{config.label}</span>
                        </motion.div>

                        {/* TOOLTIP */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                                    exit={{ opacity: 0, y: 5, x: '-50%' }}
                                    className="absolute bottom-full left-1/2 mb-4 w-64 pointer-events-none z-[100]"
                                >
                                    <div className="bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-subtle)] p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                                        {/* Borde Neón lateral */}
                                        <div className={`absolute top-0 left-0 w-1 h-full ${config.color.split(' ')[0].replace('text-', 'bg-')}`} />

                                        <div className="flex items-center justify-between mb-3">
                                            <p className="font-black text-[10px] uppercase tracking-tighter text-[var(--text-muted)]">Impacto Estadístico</p>
                                            <span className={`text-[10px] font-black ${config.color.split(' ')[0]}`}>
                                                Z-SCORE: {(tag.score || 0).toFixed(2)}
                                            </span>
                                        </div>

                                        <p className="text-[var(--text-primary)] text-sm font-bold leading-tight mb-2">
                                            Rendimiento: <span className="text-[var(--accent-primary)]">Top {(100 - (tag.score * 10)).toFixed(1)}%</span>
                                        </p>

                                        <div className="h-px bg-[var(--divider)] my-3" />

                                        <p className="text-[var(--text-muted)] text-[11px] font-medium leading-relaxed italic">
                                            &quot;{tag.description}&quot;
                                        </p>
                                    </div>

                                    {/* Triángulo del tooltip */}
                                    <div className="w-3 h-3 bg-[var(--bg-card)] rotate-45 border-r border-b border-[var(--border-subtle)] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};
