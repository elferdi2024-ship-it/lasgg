'use client';
import { motion } from 'framer-motion';

export const LensLayout = ({
    leftContent,
    rightContent
}: {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">

            {/* PANEL IZQUIERDO (Resumen Cards) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 flex flex-col gap-3"
            >
                {leftContent}
            </motion.div>

            {/* PANEL DERECHO (Deep Dive Grid + Charts) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-8 flex flex-col gap-4"
            >
                {rightContent}
            </motion.div>

        </div>
    );
};
