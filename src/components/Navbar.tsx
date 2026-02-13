'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-[var(--glass-bg)] backdrop-blur-xl z-[100] border-b border-[var(--border-subtle)]">
            <div className="max-w-[1700px] mx-auto h-full px-8 flex items-center justify-between gap-12">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--neon-primary-glow)] group-hover:scale-110 transition-transform">
                        <span className="text-[var(--bg-root)] font-black text-sm italic tracking-tighter">LAS</span>
                    </div>
                    <span className="text-2xl font-display text-[var(--text-primary)] tracking-tighter">LAS.GG</span>
                </Link>

                {/* SEARCH IN NAV */}
                <div className="flex-1 max-w-2xl hidden md:block">
                    <SearchBar />
                </div>

                {/* NAV LINKS */}
                <div className="hidden lg:flex items-center gap-10">
                    <Link href="#" className="text-xs font-display text-[var(--accent-primary)] tracking-widest uppercase">Clasificación</Link>
                    <Link href="#" className="text-xs font-display text-[var(--text-muted)] hover:text-[var(--text-primary)] tracking-widest uppercase transition-colors">Campeones</Link>
                    <Link href="#" className="text-xs font-display text-[var(--text-muted)] hover:text-[var(--text-primary)] tracking-widest uppercase transition-colors">Multi-Búsqueda</Link>
                </div>

                {/* THEME TOGGLE + REGION / LANG */}
                <div className="flex items-center gap-4 border-l border-[var(--border-subtle)] pl-10 hidden sm:flex">
                    <ThemeToggle />
                    <span className="material-symbols-outlined text-[var(--text-muted)]">language</span>
                    <span className="text-[10px] font-display text-[var(--text-muted)] uppercase tracking-widest">LAS / ES</span>
                </div>
            </div>
        </nav>
    );
};
