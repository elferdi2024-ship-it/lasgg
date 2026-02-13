'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, Target, Shield, Zap } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[40px] shadow-[0_50px_150px_rgba(0,0,0,0.5)] z-[101] overflow-hidden"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-48 bg-gradient-to-br from-[var(--accent-primary)]/20 via-[var(--accent-primary)]/5 to-transparent relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--accent-primary)/15%,transparent)]" />
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-[var(--overlay-bg)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-soft)] transition-all z-10"
                            >
                                <X size={24} />
                            </button>
                            <div className="absolute bottom-0 left-16 translate-y-1/2 w-28 h-28 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center shadow-2xl">
                                <Sparkles size={56} className="text-[var(--accent-primary)]" />
                            </div>
                        </div>

                        <div className="p-16 pt-24">
                            <h2 className="text-5xl font-display uppercase tracking-tight mb-4 text-[var(--text-primary)]">Entendiendo AI-Score & Fate</h2>
                            <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-16 italic opacity-80">
                                Nuestra inteligencia artificial analiza cada acción micro y macro para predecir tu impacto real en la grieta.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* AI-Score Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                                            <Target size={24} className="text-[var(--accent-primary)]" />
                                        </div>
                                        <h3 className="font-display uppercase tracking-[0.2em] text-sm text-[var(--text-primary)]">¿Qué es el AI-Score?</h3>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                        Es una métrica de **habilidad absoluta**. No solo mide KDA, sino eficiencia de farm, impacto de visión, secuenciación de campamentos y potencia de duelo comparado con los mejores jugadores de tu región en tiempo real.
                                    </p>
                                </div>

                                {/* Fate Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-loss)]/10 flex items-center justify-center">
                                            <TrendingUp size={24} className="text-[var(--accent-loss)]" />
                                        </div>
                                        <h3 className="font-display uppercase tracking-[0.2em] text-sm text-[var(--text-primary)]">¿Qué es el Fate?</h3>
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                        Analiza tu **consistencia y proyección**. Te ayuda a entender si tu nivel actual es sostenible bajo presión o si estás en una racha de &quot;Fate&quot; (destino) que afectará tu emparejamiento futuro.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-16 p-8 rounded-[32px] bg-[var(--overlay-bg)] border border-[var(--border-subtle)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 rounded-full blur-[100px] -z-10 group-hover:bg-[var(--accent-primary)]/10 transition-colors duration-700" />
                                <h4 className="flex items-center gap-3 text-xs font-display uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-6">
                                    <Zap size={14} /> Hoja de Ruta del Jugador
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <li className="flex items-start gap-4 text-[var(--text-secondary)] text-sm">
                                        <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0 shadow-[0_0_10px_var(--neon-primary-glow)]" />
                                        <span>Usa el **Performance Lens** para identificar tus puntos ciegos en micro-decisiones.</span>
                                    </li>
                                    <li className="flex items-start gap-4 text-[var(--text-secondary)] text-sm">
                                        <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] mt-1.5 shrink-0 shadow-[0_0_10px_var(--neon-primary-glow)]" />
                                        <span>Compara tus stats con la élite usando el nuevo **Tier Selector** dinámico.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
