'use client';
import { useState, useMemo } from 'react';
import { OverviewTab, FightingTab, LaningTab, ObjectivesTab, VisionTab, SurvivabilityTab, TeamImpactTab } from './LensTabs';
import { Swords, Eye, Shield, Target, Activity, Users, Map, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDetailedLens } from '@/lib/lens-calculator';
import { TIER_BASELINES, TargetTier } from '@/lib/lens-baselines';

const TABS = [
    { id: 'overview', label: 'Resumen General', icon: Activity },
    { id: 'fighting', label: 'Combate', icon: Swords },
    { id: 'laning', label: 'Fase de Líneas', icon: Map },
    { id: 'objectives', label: 'Objetivos', icon: Target },
    { id: 'vision', label: 'Visión', icon: Eye },
    { id: 'survivability', label: 'Supervivencia', icon: Shield },
    { id: 'team', label: 'Impacto de Equipo', icon: Users },
];

export const LensContainer = ({ initialData, matches, puuid }: { initialData: any, matches: any[], puuid: string }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedTier, setSelectedTier] = useState<TargetTier>('EMERALD');
    const [isTierOpen, setIsTierOpen] = useState(false);

    // Recalcular datos basados en el tier seleccionado (detailed version)
    const currentLensData = useMemo(() => {
        return calculateDetailedLens(matches, puuid, selectedTier);
    }, [matches, puuid, selectedTier]);

    return (
        <div className="w-full bg-card-bg/80 backdrop-blur-xl rounded-3xl border border-border-dark overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] group">

            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_50%)] animate-pulse-slow opacity-50" />
                <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent opacity-20" />
            </div>

            {/* HEADER DE NAVEGACIÓN Y SELECTOR */}
            <div className="relative z-20 border-b border-border-dark bg-bg-card-soft/60 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* TABS CON FRAMER MOTION */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide mask-fade-sides">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap z-10
                                    ${isActive ? 'text-bg-root' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabBackground"
                                        className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon size={16} className={isActive ? "text-bg-root" : ""} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* SELECTOR DE COMPARACIÓN */}
                <div className="relative">
                    <button
                        onClick={() => setIsTierOpen(!isTierOpen)}
                        className={`
                            flex items-center gap-3 bg-[#1A1C20] border hover:border-primary/50 text-white text-xs font-black px-5 py-3 rounded-xl transition-all uppercase tracking-widest shadow-lg
                            ${isTierOpen ? 'border-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10'}
                        `}
                    >
                        <span className="text-text-muted font-bold text-[10px]">COMPARANDO VS</span>
                        <span className="text-primary text-sm shadow-text-neon">{selectedTier}</span>
                        <ChevronDown size={14} className={`text-text-muted transition-transform duration-300 ${isTierOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isTierOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsTierOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-[#1A1C20] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-2 backdrop-blur-xl"
                                >
                                    {Object.keys(TIER_BASELINES).reverse().map((tier) => (
                                        <button
                                            key={tier}
                                            onClick={() => { setSelectedTier(tier as TargetTier); setIsTierOpen(false); }}
                                            className={`
                                                w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest transition-all flex justify-between items-center group
                                                ${selectedTier === tier ? 'text-bg-root bg-primary' : 'text-text-muted hover:bg-white/5 hover:text-text-primary'}
                                            `}
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">{tier}</span>
                                            {selectedTier === tier && <Activity size={14} className="animate-pulse" />}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* CONTENIDO DE LA PESTAÑA */}
            <div className="relative z-10 p-6 md:p-10 min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + selectedTier}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="h-full"
                    >
                        {activeTab === 'overview' && <OverviewTab data={currentLensData} targetTier={selectedTier} />}
                        {activeTab === 'fighting' && <FightingTab data={currentLensData} targetTier={selectedTier} />}
                        {activeTab === 'laning' && <LaningTab data={currentLensData} targetTier={selectedTier} />}
                        {activeTab === 'objectives' && <ObjectivesTab data={currentLensData} targetTier={selectedTier} />}
                        {activeTab === 'vision' && <VisionTab data={currentLensData} targetTier={selectedTier} />}
                        {activeTab === 'survivability' && <SurvivabilityTab data={currentLensData} targetTier={selectedTier} />}
                        {activeTab === 'team' && <TeamImpactTab data={currentLensData} targetTier={selectedTier} />}
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
};
