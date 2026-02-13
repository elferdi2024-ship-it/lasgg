'use client';

import { polarToCartesian } from "./lens.utils";
import CenterNode from "./CenterNode";
import CategoryNode from "./CategoryNode";
import ConnectionPath from "./ConnectionPath";
import { Swords, Bean, Eye, Shield, Target, Shuffle } from 'lucide-react'; // Iconos sugeridos

// Tipos de tus datos reales
import { LensAnalysis } from '@/types';

// Mapeo de configuración visual
const CONFIG_MAP: Record<string, { color: string, icon: any }> = {
    'Fighting': { color: '#5B6CFF', icon: Swords }, // Azul
    'Farming': { color: '#FFC84E', icon: Bean },    // Amarillo
    'Vision': { color: '#4EFFC3', icon: Eye },      // Verde neón
    'Objectives': { color: '#B07CFF', icon: Target }, // Violeta
    'Survivability': { color: '#FF6B6B', icon: Shield }, // Rojo
    'Aggression': { color: '#FF9F43', icon: Swords }, // Naranja
    'Adaptability': { color: '#54A0FF', icon: Shuffle },
};

export default function LensCanvas({ data }: { data: LensAnalysis }) {
    const SIZE = 500; // Tamaño del canvas SVG
    const CENTER = SIZE / 2;
    const RADIUS = 180; // Radio de dispersión de nodos

    const metrics = data?.metrics || [];
    const globalScore = data?.globalScore || 0;

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center bg-[#0E0F11] rounded-2xl overflow-hidden border border-[#2A2D34]">

            {/* Fondo Grilla Decorativa */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#2A2D34 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="relative w-[500px] h-[500px]">
                <svg width={SIZE} height={SIZE} className="absolute inset-0 pointer-events-none">
                    {metrics.map((metric, i) => {
                        const angleStep = (2 * Math.PI) / metrics.length;
                        const angle = i * angleStep - Math.PI / 2;
                        const { x, y } = polarToCartesian(CENTER, CENTER, RADIUS, angle);

                        const config = CONFIG_MAP[metric.category] || { color: '#fff' };

                        return (
                            <ConnectionPath
                                key={metric.category}
                                from={{ x: CENTER, y: CENTER }}
                                to={{ x, y }}
                                color={config.color}
                            />
                        );
                    })}
                </svg>

                <CenterNode score={globalScore} />

                {metrics.map((metric, i) => {
                    const angleStep = (2 * Math.PI) / metrics.length;
                    const angle = i * angleStep - Math.PI / 2;
                    const pos = polarToCartesian(CENTER, CENTER, RADIUS, angle);
                    const config = CONFIG_MAP[metric.category] || { color: '#fff', icon: null };

                    return (
                        <CategoryNode
                            key={metric.category}
                            x={pos.x}
                            y={pos.y}
                            color={config.color}
                            score={metric.score}
                            label={metric.label || metric.category}
                            icon={config.icon}
                        />
                    );
                })}
            </div>
        </div>
    )
}
