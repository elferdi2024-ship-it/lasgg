'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] animate-pulse" />
        );
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center hover:border-[var(--accent-primary)] hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
        >
            {/* Sun Icon (shown in dark mode → click to go light) */}
            <Sun
                size={18}
                className={`absolute transition-all duration-500 ${isDark
                    ? 'rotate-0 scale-100 opacity-100 text-amber-400'
                    : 'rotate-90 scale-0 opacity-0'
                    }`}
            />

            {/* Moon Icon (shown in light mode → click to go dark) */}
            <Moon
                size={18}
                className={`absolute transition-all duration-500 ${isDark
                    ? '-rotate-90 scale-0 opacity-0'
                    : 'rotate-0 scale-100 opacity-100 text-indigo-500'
                    }`}
            />

            {/* Glow ring on hover */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark
                ? 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                }`}
            />
        </button>
    );
};
