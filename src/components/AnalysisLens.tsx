'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LensAnalysis } from '@/types'; // Importa tus tipos

export const AnalysisLens = ({ data }: { data: LensAnalysis }) => {
    const [hovered, setHovered] = useState<number | null>(null);

    if (!data || data.metrics.length === 0) return null;

    const size = 300;
    const center = size / 2;
    const radius = 100;
    const angleStep = (Math.PI * 2) / data.metrics.length;

    const getPoint = (index: number, value: number) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (Math.min(value, 100) / 100) * radius; // Cap en 100 para dibujo
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    const userPath = data.metrics.map((d, i) => {
        const p = getPoint(i, d.score);
        return `${p.x},${p.y}`;
    }).join(' ');

    const fullPath = data.metrics.map((_, i) => {
        const p = getPoint(i, 100);
        return `${p.x},${p.y}`;
    }).join(' ');

    // Colores dinámicos para el Tier
    const tierColor = data.tier.includes('S') ? 'text-accent-yellow' : data.tier.includes('A') ? 'text-accent-green' : 'text-accent-primary';

    return (
        <div className="w-full bg-bg-card border border-border-subtle rounded-xl p-6 relative overflow-hidden shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-accent-primary rounded-sm shadow-[0_0_10px_#4DA3FF]"></span>
                        DPM LENS
                    </h2>
                    <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider font-bold">VS Challenger Baseline</p>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${tierColor} drop-shadow-lg`}>{data.tier}</div>
                    <div className="text-[10px] text-text-muted font-bold">GLOBAL SCORE: {data.globalScore}</div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">

                {/* RADAR */}
                <div className="relative w-[300px] h-[300px] shrink-0">
                    <svg width={size} height={size} className="overflow-visible">
                        {/* Background Grid */}
                        <path d={fullPath} fill="var(--bg-card-soft)" stroke="var(--border-subtle)" strokeWidth="1" />
                        {[0.25, 0.5, 0.75].map(scale => (
                            <path key={scale} d={data.metrics.map((_, i) => {
                                const p = getPoint(i, 100 * scale);
                                return `${p.x},${p.y}`;
                            }).join(' ')} fill="none" stroke="var(--border-subtle)" strokeOpacity="0.3" strokeDasharray="3 3" />
                        ))}

                        {/* Rayos */}
                        {data.metrics.map((_, i) => {
                            const p = getPoint(i, 100);
                            return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--border-subtle)" strokeWidth="1" />;
                        })}

                        {/* SHAPE USUARIO */}
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.7 }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            d={`M ${userPath} Z`}
                            fill="url(#radarGradient)"
                            stroke="var(--accent-primary)"
                            strokeWidth="2.5"
                            className="drop-shadow-[0_0_15px_rgba(77,163,255,0.4)]"
                        />

                        <defs>
                            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
                            </linearGradient>
                        </defs>

                        {/* PUNTOS INTERACTIVOS */}
                        {data.metrics.map((d, i) => {
                            const p = getPoint(i, d.score);
                            const labelP = getPoint(i, 120);

                            return (
                                <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className="cursor-pointer group">
                                    <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-root)" stroke={d.score >= 80 ? 'var(--accent-yellow)' : 'var(--accent-primary)'} strokeWidth="2" />

                                    {/* Etiqueta Externa */}
                                    <text
                                        x={labelP.x} y={labelP.y}
                                        textAnchor="middle" dominantBaseline="middle"
                                        className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${hovered === i ? 'fill-white' : 'fill-text-muted'}`}
                                    >
                                        {d.category}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* DATA LIST */}
                <div className="w-full space-y-2">
                    {data.metrics.map((d, i) => {
                        const diff = ((d.value - d.challengerAvg) / d.challengerAvg) * 100;
                        const isPositive = diff >= 0;

                        return (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-2.5 rounded-lg border border-transparent transition-all ${hovered === i ? 'bg-bg-card-soft border-border-subtle' : 'hover:bg-bg-card-soft/50'}`}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${d.score >= 80 ? 'bg-accent-yellow shadow-[0_0_8px_#F5C451]' : d.score >= 50 ? 'bg-accent-primary' : 'bg-accent-red'}`} />
                                    <div>
                                        <div className="text-[11px] font-bold text-text-primary uppercase">{d.category}</div>
                                        <div className="text-[9px] text-text-muted">{d.label}: <span className="text-text-secondary">{d.value.toFixed(1)}</span></div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-black text-text-primary">{d.score}</div>
                                    <div className={`text-[9px] font-bold ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                                        {isPositive ? '+' : ''}{diff.toFixed(0)}% <span className="text-text-disabled font-normal">vs Challi</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};
