'use client';
import { motion } from "framer-motion";

export default function CenterNode({ score }: { score: number }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-2xl flex flex-col items-center justify-center z-20"
            style={{
                background: 'linear-gradient(145deg, #1A1C20, #0E0F11)',
                boxShadow: '0 0 40px rgba(77, 163, 255, 0.15), inset 0 0 20px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}
        >
            <span className="text-3xl font-black text-white">{score}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Score</span>

            {/* Efecto de pulso detrás */}
            <div className="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-blue-500/20 -z-10" style={{ animationDuration: '3s' }} />
        </motion.div>
    )
}
