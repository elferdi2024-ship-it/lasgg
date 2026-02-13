'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ActiveGameDisplay } from './ActiveGameDisplay';
import { ActiveGameInfo } from '@/types';

interface LiveGameContainerProps {
    puuid: string;
    riotId: string;
    tagLine: string;
}

export const LiveGameContainer = ({ puuid, riotId, tagLine }: LiveGameContainerProps) => {
    const [loading, setLoading] = useState(true);
    const [game, setGame] = useState<ActiveGameInfo | null>(null);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    const fetchLiveGame = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch(`/api/live/${puuid}`);
            if (!res.ok) throw new Error('Failed to check live game status');

            const data = await res.json();

            if (data.inGame) {
                setGame(data.game);
            } else {
                setGame(null);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (puuid) {
            fetchLiveGame();
        }
    }, [puuid, retryCount]);

    const handleRetry = () => setRetryCount(prev => prev + 1);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 text-[var(--text-primary)]">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--accent-primary)] mb-4" />
            <p className="text-sm font-display uppercase tracking-widest">Buscando Partida en Curso...</p>
        </div>
    );

    if (error) return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-2xl text-center max-w-lg mx-auto">
            <AlertTriangle className="w-10 h-10 text-[var(--accent-loss)] mx-auto mb-4" />
            <h3 className="text-xl font-display mb-2">Error de Conexión</h3>
            <p className="text-[var(--text-muted)] mb-6 text-sm">{error}</p>
            <button onClick={handleRetry} className="text-sm underline hover:text-[var(--accent-primary)]">
                Reintentar
            </button>
        </div>
    );

    if (!game) return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-16 rounded-[40px] text-center shadow-inner relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--text-muted)] to-transparent opacity-20" />

            <div className="w-20 h-20 bg-[var(--bg-root)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border-subtle)]">
                <span className="material-symbols-outlined text-4xl text-[var(--text-disabled)]">sports_esports</span>
            </div>

            <h2 className="text-xl font-display uppercase tracking-widest mb-2 text-[var(--text-muted)]">Invocador Offline</h2>
            <p className="text-[var(--text-disabled)] mb-8 text-sm">
                {decodeURIComponent(riotId)} #{tagLine} no está en una partida activa.
            </p>

            <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-[var(--overlay-bg)] border border-[var(--border-subtle)] px-6 py-2.5 rounded-xl hover:bg-[var(--accent-primary)] hover:text-white transition-all uppercase font-display text-xs tracking-widest"
            >
                <RefreshCw size={14} /> Actualizar Estado
            </button>
        </div>
    );

    return <ActiveGameDisplay game={game} />;
};
