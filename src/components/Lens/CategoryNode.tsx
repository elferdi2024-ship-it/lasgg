'use client';
import { motion } from "framer-motion";

export default function CategoryNode({
    x,
    y,
    color,
    score,
    label,
    icon: Icon
}: {
    x: number
    y: number
    color: string
    score: number
    label: string
    icon?: any
}) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{
                left: x - 30, // Mitad del ancho (60px)
                top: y - 30,
                background: 'linear-gradient(145deg, #1F2228, #121417)',
                border: `1px solid ${color}40`, // Color con transparencia
                boxShadow: `0 0 20px ${color}20`, // Glow suave
                position: 'absolute'
            }}
            className="w-[60px] h-[60px] rounded-xl flex flex-col items-center justify-center cursor-pointer z-10 group"
        >
            {/* Icono o Label */}
            <div className="text-white mb-1" style={{ color: color }}>
                {Icon ? <Icon size={20} /> : <span className="text-xs font-bold">{label.substring(0, 2)}</span>}
            </div>

            {/* Score */}
            <span className="text-sm font-bold text-white">{score}</span>

            {/* Tooltip flotante (Nombre completo) */}
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap border border-white/10 pointer-events-none">
                {label}
            </div>
        </motion.div>
    )
}
