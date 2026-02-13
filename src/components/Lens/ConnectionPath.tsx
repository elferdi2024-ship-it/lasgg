'use client';
import { motion } from "framer-motion";

export default function ConnectionPath({
    from,
    to,
    color
}: {
    from: { x: number; y: number }
    to: { x: number; y: number }
    color: string
}) {
    // Curvatura orgánica: El punto de control está desplazado para crear la curva
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - 40; // Ajusta -40 para más o menos curva

    const d = `
    M ${from.x} ${from.y}
    Q ${midX} ${midY} ${to.x} ${to.y}
  `;

    return (
        <motion.path
            d={d}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
    )
}
