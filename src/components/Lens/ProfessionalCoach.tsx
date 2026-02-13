'use client';
import { useState } from 'react';
import { DetailedLensAnalysis } from '@/types';
import { TargetTier, TIER_BASELINES } from '@/lib/lens-baselines';
import { Bot, Sparkles, TrendingUp, Target, AlertCircle, ChevronDown, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfessionalCoach = ({ data, targetTier }: { data: DetailedLensAnalysis, targetTier: TargetTier }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const baseline = TIER_BASELINES[targetTier];

    // Logic to find the biggest gaps
    const advice = [];

    // Fighting check
    if (data.fighting.damagePerMinute < baseline.dpm * 0.9) {
        advice.push({
            title: 'Daño Insuficiente',
            message: `Tu DPM (${Math.round(data.fighting.damagePerMinute)}) está por debajo del promedio de ${targetTier} (${baseline.dpm}). Busca tradear de forma más agresiva en mid-game.`,
            icon: Target,
            color: 'text-blue-400',
            bg: 'bg-blue-500/5',
            detail: 'Deberías enfocarte en participar en más escaramuzas y optimizar tus combos para maximizar el DPS en las peleas de equipo.'
        });
    }

    // Farming check
    if (data.laning.csPerMin < baseline.cs * 0.9) {
        advice.push({
            title: 'Optimizar Farm',
            message: `Promedias ${data.laning.csPerMin.toFixed(1)} CS/min. Para ${targetTier} deberías apuntar a ${baseline.cs} CS/min. No descuides el farm al rotar.`,
            icon: TrendingUp,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/5',
            detail: 'Intenta capturar oleadas laterales antes de agruparte. El oro garantizado de los súbditos es la forma más estable de escalar.'
        });
    }

    // Vision check
    if (data.vision.visionScorePerMin < baseline.vis * 0.8) {
        advice.push({
            title: 'Control de Mapa',
            message: `Tu puntuación de visión/min es baja comparada con ${targetTier}. Invierte más en Control Wards y limpieza de visión enemiga.`,
            icon: AlertCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/5',
            detail: 'Como regla general, intenta tener siempre un pink en el mapa y usa tu trinket cada vez que esté disponible en zonas de tránsito.'
        });
    }

    // fallback if everything is "perfect"
    if (advice.length === 0) {
        advice.push({
            title: 'Manten el Nivel',
            message: `Tus estadísticas son sólidas para ${targetTier}. Enfócate en la consistencia y en el macro-juego para seguir escalando.`,
            icon: Sparkles,
            color: 'text-purple-400',
            bg: 'bg-purple-500/5',
            detail: 'Estás rindiendo a un nivel excelente. El siguiente paso es perfeccionar las rotaciones de equipo y el control de objetivos neutrales.'
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-bg-card-soft/40 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Bot size={80} className="text-primary" />
            </div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Coach Profesional</h3>
                    <p className="text-[10px] text-text-muted font-bold uppercase">Análisis de Progreso vs {targetTier}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advice.slice(0, 2).map((item, i) => (
                    <div key={i} className={`bg-bg-card/50 border border-border-subtle p-4 rounded-xl flex gap-4 items-start ${isExpanded ? 'border-primary/20' : ''}`}>
                        <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                            <item.icon size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wide text-text-primary mb-1">{item.title}</h4>
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                {item.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-8 pt-8 border-t border-border-subtle space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap size={14} className="text-primary" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary">Plan de Acción Detallado</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {advice.map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={12} className={item.color} />
                                            <span className="text-[10px] font-bold text-text-primary uppercase">{item.title}</span>
                                        </div>
                                        <p className="text-[11px] text-text-muted leading-relaxed pl-5 italic">
                                            "{item.detail}"
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mt-6">
                                <div className="flex items-start gap-3">
                                    <Sparkles size={16} className="text-primary mt-0.5" />
                                    <div>
                                        <h5 className="text-[10px] font-black text-primary uppercase mb-1">Consejo Maestro</h5>
                                        <p className="text-[11px] text-text-secondary leading-relaxed">
                                            Para subir de rango a <span className="text-text-primary font-bold">{targetTier}</span>, la clave no es solo tener buenas manos, sino reducir el número de errores no forzados. Enfócate en tu <span className="text-text-primary font-bold">posicionamiento</span> y en <span className="text-text-primary font-bold">no morir innecesariamente</span> antes de objetivos importantes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-primary animate-pulse" />
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">
                        Basado en tus últimas 20 partidas
                    </span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all group/btn"
                >
                    {isExpanded ? 'Cerrar Plan de Mejora' : 'Ver Plan de Mejora Completo'}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} />
                </button>
            </div>
        </motion.div>
    );
};
