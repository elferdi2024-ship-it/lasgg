'use client';

import { SearchBar } from '@/components/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-root)] text-[var(--text-primary)] overflow-hidden relative selection:bg-[var(--accent-primary)]/30 py-32">

      {/* AMBIENT LIGHTING */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[var(--accent-primary)]/5 rounded-full blur-[150px] -z-10 opacity-60 pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[800px] h-[800px] bg-[var(--accent-loss)]/5 rounded-full blur-[150px] -z-10 opacity-30 pointer-events-none" />

      {/* HERO SECTION */}
      <div className="container mx-auto px-8 flex flex-col items-center justify-center relative z-10">

        <div className="text-center mb-16 space-y-8 max-w-5xl">
          {/* SYSTEM STATUS */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--overlay-bg)] text-[10px] font-display uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-6 shadow-2xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-primary)]"></span>
            </span>
            Motor LAS.GG en Línea
          </div>

          {/* MAIN LOGO TITULAR */}
          <div className="space-y-2">
            <h1 className="text-7xl md:text-[10rem] font-display tracking-tighter leading-none text-[var(--text-primary)] select-none">
              LAS.GG<span className="text-[var(--accent-primary)] neon-text-primary">LOL</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-2xl font-display tracking-widest uppercase opacity-80">
              ANALÍTICA DE LEAGUE NIVEL PRO
            </p>
          </div>

          {/* SUBTITLE */}
          <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium pt-4">
            No confíes en los números. Confía en la <span className="text-[var(--accent-primary)] font-black underline decoration-[var(--accent-primary)]/30 underline-offset-8">Identidad Neural</span>. La única plataforma que clasifica tu estilo de juego con el benchmark Z-Score de LAS.GG.
          </p>
        </div>

        {/* SEARCH BAR COMPONENT */}
        <div className="w-full max-w-3xl mb-32 group">
          <div className="p-2 transition-all duration-700 bg-[var(--overlay-bg)] rounded-3xl border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/20 hover:bg-[var(--bg-card-soft)] shadow-2xl relative">
            <SearchBar />
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <p className="text-[10px] text-[var(--text-disabled)] font-display uppercase tracking-[0.3em]">Regiones Soportadas: LAS • NA • EUW • KR</p>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          <FeatureItem
            icon="auto_awesome"
            title="Etiquetado de Identidad"
            desc="Etiquetas de aprendizaje automático que definen tu verdadero impacto en cada partida."
            color="text-[var(--accent-primary)]"
          />
          <FeatureItem
            icon="military_tech"
            title="Matriz Z-Score"
            desc="Compara tus estadísticas con el promedio de Challenger por temporada."
            color="text-[var(--accent-win)]"
          />
          <FeatureItem
            icon="verified"
            title="Predicción de Destino"
            desc="Nuestro motor predice tu trayectoria de LP basada en la varianza de rendimiento."
            color="text-[var(--accent-loss)]"
          />
        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-32 border-t border-[var(--border-subtle)] py-12 bg-[var(--overlay-bg)]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between text-[var(--text-muted)] gap-8">
          <div className="flex items-center gap-4">
            <span className="text-xs font-display tracking-widest text-[var(--text-primary)]">LAS.GG</span>
            <span className="text-[10px] font-bold">© 2026 ALPHA v1.02</span>
          </div>
          <p className="text-[10px] font-black tracking-widest uppercase text-center max-w-md">
            LAS.GG no está avalado por Riot Games y no refleja los puntos de vista u opiniones de Riot Games.
          </p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-xl hover:text-[var(--text-primary)] cursor-pointer transition-colors">terminal</span>
            <span className="material-symbols-outlined text-xl hover:text-[var(--text-primary)] cursor-pointer transition-colors">share</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureItem({ icon, title, desc, color }: any) {
  return (
    <div className="stat-card group hover:-translate-y-2 transition-all duration-500">
      <div className={`w-14 h-14 rounded-2xl bg-[var(--overlay-bg)] border border-[var(--border-subtle)] flex items-center justify-center mb-8 group-hover:border-[var(--accent-primary)]/50 group-hover:scale-110 transition-all ${color}`}>
        <span className="material-symbols-outlined text-3xl fill-1">{icon}</span>
      </div>
      <h3 className="text-xl font-display text-[var(--text-primary)] mb-3 uppercase tracking-tighter">{title}</h3>
      <p className="text-[var(--text-muted)] text-sm leading-relaxed font-semibold">{desc}</p>
    </div>
  );
}
