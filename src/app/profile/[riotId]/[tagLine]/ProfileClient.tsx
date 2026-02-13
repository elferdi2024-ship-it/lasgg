'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfileHeader } from '@/components/ProfileHeader';
import { StatsSidebar } from '@/components/StatsSidebar';
import { TagRail } from '@/components/TagRail';
import { MatchCard } from '@/components/MatchCard';
import { MatchSummary } from '@/components/MatchSummary';
import { LiveGameContainer } from '@/components/LiveGame/LiveGameContainer';
import { MasteryList } from '@/components/Mastery/MasteryList';
import { LensContainer } from '@/components/Lens/LensContainer';
import { HelpModal } from '@/components/HelpModal';
import { Loader2, AlertTriangle, HelpCircle, Zap, Skull } from 'lucide-react';
import Link from 'next/link';

export default function ProfileClient() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'lens' | 'summary' | 'champions' | 'live'>('summary');
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const fetchData = async (forceRefresh = false) => {
        try {
            setLoading(true);
            const riotId = params?.riotId;
            const tagLine = params?.tagLine;

            if (!riotId || !tagLine) return;

            const url = `/api/profile/${riotId}/${tagLine}${forceRefresh ? '?refresh=true' : ''}`;
            const response = await fetch(url, {
                next: { revalidate: forceRefresh ? 0 : 300 }
            });
            if (!response.ok) throw new Error('Failed to fetch summoner data');

            const result = await response.json();
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params]);

    const handleRefresh = () => {
        fetchData(true);
    };

    // --- LOADING STATE ---
    if (loading) return (
        <div className="min-h-screen bg-[var(--bg-root)] flex flex-col items-center justify-center text-[var(--text-primary)] relative overflow-hidden">
            <div className="relative z-10 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-[var(--accent-primary)] mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl font-display tracking-widest uppercase animate-pulse">Analizando Invocador...</h2>
                <p className="text-[var(--text-muted)] mt-2 text-xs font-mono uppercase tracking-[0.2em]">Escaneo Profundo y Generación de Etiquetas</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        </div>
    );

    // --- ERROR STATE ---
    if (error) return (
        <div className="min-h-screen bg-[var(--bg-root)] flex flex-col items-center justify-center text-[var(--text-primary)] p-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-16 rounded-[40px] text-center max-w-lg shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-loss)] to-transparent opacity-50" />
                <div className="w-24 h-24 rounded-3xl bg-[var(--accent-loss)]/5 border border-[var(--accent-loss)]/10 flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500">
                    <AlertTriangle className="w-12 h-12 text-[var(--accent-loss)]" />
                </div>
                <h2 className="text-3xl font-display mb-4 tracking-tighter uppercase whitespace-nowrap">Error de Sincronización</h2>
                <p className="text-[var(--text-muted)] text-sm mb-12 leading-relaxed font-semibold italic opacity-80">
                    {error}
                </p>
                <Link href="/" className="inline-flex items-center justify-center bg-[var(--overlay-bg)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-12 py-5 rounded-2xl font-display hover:bg-[var(--accent-primary)] hover:text-[var(--bg-root)] transition-all uppercase text-xs tracking-[0.2em] shadow-xl">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );

    if (!data) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-root)] text-[var(--text-primary)] pb-32">

            {/* MAIN CONTENT (Wide Layout) */}
            <div className="max-w-[1700px] mx-auto px-8 pt-12">

                {/* 1. HERO HEADER */}
                <ProfileHeader data={data} onUpdate={handleRefresh} />

                {/* 2. GRID LAYOUT */}
                <div className="flex flex-col xl:flex-row gap-12">

                    {/* LEFT COLUMN: STATS & TAGS */}
                    <div className="w-full xl:w-[380px] shrink-0 space-y-10">
                        <StatsSidebar data={data} />

                        {/* Gaming Identity (Tags) - Rediseñado para Impacto */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-10 rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.15)] relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-3xl -z-10" />

                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xs font-display text-[var(--accent-primary)] uppercase tracking-[0.3em] mb-1">Identidad de Juego</h3>
                                    <p className="text-[var(--text-muted)] text-[11px] font-medium italic">Análisis de ADN competitivo</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center border border-[var(--accent-primary)]/20">
                                    <span className="material-symbols-outlined text-[var(--accent-primary)] text-2xl">dns</span>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {/* STRENGTHS */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-[10px] font-display text-[var(--accent-win)] uppercase tracking-widest mb-4 opacity-80">
                                        <Zap size={12} /> Fortalezas Dominantes
                                    </h4>
                                    {data.tags && data.tags.filter((t: any) => t.type === 'STRENGTH').length > 0 ? (
                                        <TagRail tags={data.tags.filter((t: any) => t.type === 'STRENGTH')} />
                                    ) : (
                                        <p className="text-[var(--text-disabled)] text-[10px] italic ml-2">En búsqueda de tu potencial...</p>
                                    )}
                                </div>

                                {/* WEAKNESSES */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-[10px] font-display text-[var(--accent-loss)] uppercase tracking-widest mb-4 opacity-80">
                                        <Skull size={12} /> Áreas de Mejora
                                    </h4>
                                    {data.tags && data.tags.filter((t: any) => t.type === 'WEAKNESS').length > 0 ? (
                                        <TagRail tags={data.tags.filter((t: any) => t.type === 'WEAKNESS')} />
                                    ) : (
                                        <p className="text-[var(--text-disabled)] text-[10px] italic ml-2">Sin debilidades críticas detectadas.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ANALYSIS & HISTORY */}
                    <div className="flex-1 min-w-0 space-y-10">

                        {/* --- UNIFIED NAVIGATION TABS --- */}
                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] mb-2">
                            <div className="flex gap-12">
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={`nav-link ${activeTab === 'summary' ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Historial
                                </button>
                                <button
                                    onClick={() => setActiveTab('lens')}
                                    className={`nav-link ${activeTab === 'lens' ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Performance Lens
                                </button>
                                <button
                                    onClick={() => setActiveTab('champions')}
                                    className={`nav-link ${activeTab === 'champions' ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Campeones
                                </button>
                                <button
                                    onClick={() => setActiveTab('live')}
                                    className={`nav-link flex items-center gap-3 ${activeTab === 'live' ? 'active' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    En Vivo <span className={`w-3 h-3 rounded-full bg-[var(--accent-loss)] ${activeTab === 'live' ? 'animate-pulse neon-glow-loss' : 'opacity-40'}`}></span>
                                </button>
                            </div>
                            <div
                                onClick={() => setIsHelpOpen(true)}
                                className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] mb-5 cursor-pointer hover:text-[var(--accent-primary)] transition-all group"
                            >
                                <span className="group-hover:tracking-wider transition-all uppercase tracking-tight">¿Qué es AI-Score & Fate?</span>
                                <HelpCircle className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                            </div>
                        </div>

                        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

                        {activeTab === 'lens' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <LensContainer
                                    initialData={data.lens}
                                    matches={data.matches}
                                    puuid={data.profile?.puuid}
                                />
                            </div>
                        )}

                        {activeTab === 'summary' && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                <MatchSummary matches={data.matches} puuid={data.profile?.puuid} />

                                {/* FILTERS & HISTORY (Always visible in Summary Tab) */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex gap-10">
                                            <button className="text-xs font-display text-[var(--accent-primary)] uppercase tracking-[0.2em] relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-1 after:bg-[var(--accent-primary)] after:rounded-full">Todas las Partidas</button>
                                            <button className="text-xs font-display text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-[0.2em] transition-colors">SoloQ</button>
                                            <button className="text-xs font-display text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-[0.2em] transition-colors">FlexQ</button>
                                        </div>
                                    </div>

                                    {/* MATCH LIST */}
                                    <div className="space-y-1 pt-4">
                                        {data.matches && data.matches.length > 0 ? (
                                            data.matches.map((match: any) => (
                                                <MatchCard
                                                    key={match.metadata?.matchId || match.matchId}
                                                    match={match}
                                                    puuid={data.profile?.puuid}
                                                />
                                            ))
                                        ) : (
                                            <div className="p-32 text-center text-[var(--text-disabled)] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[40px] shadow-inner">
                                                <AlertTriangle className="w-12 h-12 mx-auto mb-6 opacity-20" />
                                                <p className="font-display uppercase tracking-[0.3em] text-sm">Target history is currently private or empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'champions' && (
                            <div className="animate-in fade-in duration-500">
                                <MasteryList puuid={data.profile.puuid} />
                            </div>
                        )}

                        {activeTab === 'live' && (
                            <div className="animate-in fade-in duration-500">
                                <LiveGameContainer
                                    puuid={data.profile.puuid}
                                    riotId={data.profile.gameName}
                                    tagLine={data.profile.tagLine}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
