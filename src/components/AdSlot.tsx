"use client";

export function AdSlot({ type = "horizontal" }: { type?: "horizontal" | "sidebar" }) {
    return (
        <div className={`w-full bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center p-4 group transition-colors hover:border-cyan-500/20 ${type === 'sidebar' ? 'aspect-square' : 'h-24'}`}>
            <div className="text-center">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500 transition-colors">ADVERTISEMENT SPACE</span>
                {type === 'sidebar' && (
                    <p className="text-[8px] text-slate-800 font-bold mt-2 uppercase">REACH 1M+ SUMMONERS</p>
                )}
            </div>
        </div>
    );
}
