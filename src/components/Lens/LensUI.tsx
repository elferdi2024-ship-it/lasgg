'use client';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

// --- 1. MINI SCORE RING (Anillo de puntuación) ---
export const LensMiniScoreRing = ({ score, color }: { score: number; color: string }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r={radius} stroke="var(--bg-card-soft)" strokeWidth="4" fill="transparent" />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    cx="26" cy="26" r={radius}
                    stroke={color} strokeWidth="4" fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute text-sm font-black text-text-primary">{score}</span>
        </div>
    );
};

// --- 2. STAT CARD (Panel Izquierdo) ---
export const LensStatCard = ({ title, subtitle, score, color, active = false, onClick }: any) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-200
      ${active ? 'bg-bg-card-soft border-primary/40 shadow-lg' : 'bg-bg-card border-border-subtle hover:bg-bg-card-soft hover:border-border-subtle/50'}
    `}
    >
        <div>
            <h4 className="text-base font-bold text-text-primary tracking-tight">{title}</h4>
            <p className="text-sm text-text-muted uppercase tracking-tight font-medium mt-0.5">{subtitle}</p>
        </div>
        <LensMiniScoreRing score={score} color={color} />
    </div>
);

// --- 3. STAT BOX (Panel Derecho - Grid) ---
export const LensStatBox = ({ label, value, trend, subtext }: any) => (
    <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl flex flex-col justify-between h-[120px] shadow-sm">
        <span className="text-sm text-text-muted font-bold uppercase tracking-tight">{label}</span>

        <div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-text-primary tracking-tight">{value}</span>
                {trend && (
                    <div className={`flex items-center text-sm font-bold mb-1 ${trend === 'up' ? 'text-accent-green' : trend === 'down' ? 'text-accent-red' : 'text-gray-500'
                        }`}>
                        {trend === 'up' ? <ArrowUp size={16} /> : trend === 'down' ? <ArrowDown size={16} /> : <Minus size={16} />}
                    </div>
                )}
            </div>
            {subtext && <p className="text-xs text-gray-600 mt-1">{subtext}</p>}
        </div>
    </div>
);

// --- 4. DISTRIBUTION BAR (Gráfico de Elo visual) ---
export const LensDistribution = ({ playerValue, baseline, label }: { playerValue: number; baseline?: number; label?: string }) => {
    const bars = [10, 25, 45, 70, 90, 60, 30, 15, 5];
    const ratio = baseline ? Math.min(1, playerValue / baseline) : 0.65;
    const markerPos = Math.min(92, Math.max(8, ratio * 100));

    return (
        <div className="w-full h-36 bg-bg-card border border-border-subtle rounded-xl p-5 flex flex-col justify-end relative overflow-hidden mt-4">
            <div className="absolute top-3 left-4 text-xs text-text-muted font-bold uppercase tracking-wide">
                {label || 'Distribución vs Rango'}
            </div>

            <div className="flex items-end justify-between gap-1.5 h-20 w-full px-2">
                {bars.map((h, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group hover:bg-white/10 transition-colors" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">
                            {h}% Jugadores
                        </div>
                    </div>
                ))}
            </div>

            {/* Player marker */}
            <div className="absolute top-9 bottom-0 w-[2px] bg-accent-yellow z-10 shadow-[0_0_10px_#00F0FF]"
                style={{ left: `${markerPos}%` }}>
                <div className="absolute -top-1 -translate-x-1/2 bg-accent-yellow text-black font-bold text-xs px-2 py-0.5 rounded-sm">TÚ</div>
            </div>
        </div>
    );
};

// --- 5. COMPARISON BAR (Player value vs Tier baseline) ---
export const LensComparisonBar = ({ label, playerValue, baseline, unit = '', color = '#00F0FF' }: {
    label: string;
    playerValue: number;
    baseline: number;
    unit?: string;
    color?: string;
}) => {
    const maxVal = Math.max(playerValue, baseline) * 1.2 || 1;
    const playerPct = Math.min(100, (playerValue / maxVal) * 100);
    const baselinePct = Math.min(100, (baseline / maxVal) * 100);
    const isAbove = playerValue >= baseline;

    return (
        <div className="bg-bg-card border border-border-subtle rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted font-bold uppercase tracking-wide">{label}</span>
                <span className={`text-base font-black ${isAbove ? 'text-[#00FF66]' : 'text-[#FF5C5C]'}`}>
                    {typeof playerValue === 'number' && playerValue % 1 !== 0 ? playerValue.toFixed(1) : playerValue}{unit}
                </span>
            </div>
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${playerPct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: isAbove ? color : '#FF5C5C' }}
                />
                {/* baseline marker */}
                <div
                    className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-white/50 z-10"
                    style={{ left: `${baselinePct}%` }}
                />
            </div>
            <div className="text-xs text-gray-600 text-right">
                {isAbove ? '▲' : '▼'} Objetivo: {typeof baseline === 'number' && baseline % 1 !== 0 ? baseline.toFixed(1) : baseline}{unit}
            </div>
        </div>
    );
};
