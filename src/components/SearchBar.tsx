'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Star, ChevronRight } from 'lucide-react';

interface SearchItem {
    name: string;
    tag: string;
    region: string;
    isFavorite: boolean;
    timestamp: number;
}

export const SearchBar = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
    const [history, setHistory] = useState<SearchItem[]>([]);
    const [results, setResults] = useState<SearchItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 0. BUSCAR SUGERENCIAS (Autocomplete)
    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 4) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data.results) {
                    setResults(data.results);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // 1. CARGAR HISTORIAL AL INICIO
    useEffect(() => {
        const saved = localStorage.getItem('search_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Error loading history:", e);
            }
        }
    }, []);

    // 2. GUARDAR EN LOCALSTORAGE
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('search_history', JSON.stringify(history));
        }
    }, [history]);

    const handleSearch = (e?: React.FormEvent, item?: SearchItem) => {
        e?.preventDefault();
        let targetName = item ? item.name : query;
        let targetTag = item ? item.tag : 'LAS';

        if (!item && query.includes('#')) {
            const parts = query.split('#');
            targetName = parts[0].trim();
            targetTag = parts[1].trim();
        } else if (!item) {
            targetName = query.trim();
        }

        if (!targetName) return;

        // Solo guardamos en historial si no existe ya
        const newItem: SearchItem = {
            name: targetName,
            tag: targetTag,
            region: item?.region || 'LAS',
            isFavorite: item?.isFavorite || false,
            timestamp: Date.now()
        };

        setHistory(prev => {
            const filtered = prev.filter(h => !(h.name.toLowerCase() === newItem.name.toLowerCase() && h.tag.toLowerCase() === newItem.tag.toLowerCase()));
            return [newItem, ...filtered].slice(0, 10);
        });

        setIsOpen(false);
        setQuery('');
        router.push(`/profile/${targetName}/${targetTag}`);
    };

    const toggleFavorite = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newHistory = [...history];
        newHistory[index].isFavorite = !newHistory[index].isFavorite;
        setHistory(newHistory);
    };

    const removeItem = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newHistory = history.filter((_, i) => i !== index);
        setHistory(newHistory);
        if (newHistory.length === 0) localStorage.removeItem('search_history');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayList = activeTab === 'recent' ? history : history.filter(i => i.isFavorite);

    return (
        <div className="relative w-full z-50 font-sans" ref={dropdownRef}>

            {/* SEARCH INPUT */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl pointer-events-none transition-colors group-focus-within:text-[var(--accent-primary)]">
                    search
                </span>
                <input
                    type="text"
                    className="w-full bg-[var(--bg-card-soft)] border-[var(--border-subtle)] border rounded-xl pl-14 pr-6 py-3.5 text-sm focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:bg-[var(--bg-card)] focus:border-transparent transition-all placeholder:text-[var(--text-disabled)] text-[var(--text-primary)] outline-none shadow-xl"
                    placeholder="Buscar Invocador (ej: Docttore46)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
            </div>

            {/* DROPDOWN */}
            {isOpen && (history.length > 0 || activeTab === 'favorites' || query.length >= 4) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* TABS HEADER */}
                    <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-card-soft)]">
                        {query.length >= 4 ? (
                            <div className="flex-1 py-4 text-center text-[10px] font-display uppercase tracking-[0.2em] text-[var(--accent-primary)] bg-[var(--overlay-bg)] border-b-2 border-[var(--accent-primary)]">
                                Resultados para &quot;{query}&quot;
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setActiveTab('recent')}
                                    className={`flex-1 py-4 text-[10px] font-display uppercase tracking-[0.2em] transition-all ${activeTab === 'recent' ? 'text-[var(--accent-primary)] bg-[var(--overlay-bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Recientes
                                </button>
                                <button
                                    onClick={() => setActiveTab('favorites')}
                                    className={`flex-1 py-4 text-[10px] font-display uppercase tracking-[0.2em] transition-all ${activeTab === 'favorites' ? 'text-[var(--accent-primary)] bg-[var(--overlay-bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    Favoritos
                                </button>
                            </>
                        )}
                    </div>

                    {/* ITEM LIST */}
                    <div className="max-h-[350px] overflow-y-auto scrollbar-hide divide-y divide-[var(--divider)]">
                        {isLoading ? (
                            <div className="p-12 text-center flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[10px] font-display text-[var(--text-muted)] uppercase tracking-widest">Buscando en Riot Games...</p>
                            </div>
                        ) : query.length >= 4 && results.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center gap-4">
                                <span className="material-symbols-outlined text-4xl text-[var(--text-disabled)]">search_off</span>
                                <p className="text-[10px] font-display text-[var(--text-disabled)] uppercase tracking-widest">No se encontraron invocadores</p>
                            </div>
                        ) : (
                            (query.length >= 4 ? results : displayList).map((item, idx) => {
                                const realIndex = history.findIndex(h => h.name === item.name && h.tag === item.tag);
                                return (
                                    <div
                                        key={idx}
                                        onClick={(e) => handleSearch(e, item)}
                                        className="flex items-center gap-4 p-5 hover:bg-[var(--bg-card-soft)] cursor-pointer group transition-all"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-[var(--overlay-bg)] flex items-center justify-center border border-[var(--border-subtle)] text-[9px] font-black text-[var(--text-muted)] group-hover:border-[var(--accent-primary)]/50 group-hover:text-[var(--accent-primary)] transition-colors uppercase">
                                            {item.tag || 'LAS'}
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <span className="text-sm font-display text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{item.name}</span>
                                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase opacity-60">#{item.tag}</span>
                                        </div>

                                        {query.length < 4 && (
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={(e) => toggleFavorite(e, realIndex)}
                                                    className={`p-2 rounded-lg bg-[var(--overlay-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-all ${item.isFavorite ? 'text-[var(--accent-primary)]' : 'text-[var(--text-disabled)]'}`}
                                                >
                                                    <Star size={14} fill={item.isFavorite ? "currentColor" : "none"} />
                                                </button>
                                                <button
                                                    onClick={(e) => removeItem(e, realIndex)}
                                                    className="p-2 rounded-lg bg-[var(--overlay-bg)] border border-[var(--border-subtle)] hover:border-[var(--accent-loss)]/30 hover:text-[var(--accent-loss)] text-[var(--text-disabled)] transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                        <ChevronRight size={16} className="text-[var(--text-disabled)] group-hover:text-[var(--accent-primary)] transition-colors" />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
