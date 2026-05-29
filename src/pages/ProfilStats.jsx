import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Flame, Target, TrendingUp } from 'lucide-react';
import { PageTransition } from '../components/PageTransition.jsx';

const MODE_META = {
  doublette: { label: 'Doublette', color: '#2F6BF6' },
  triplette: { label: 'Triplette', color: '#FFD12E' },
  tete_a_tete: { label: 'Tête-à-tête', color: '#FB923C' },
};

function WinrateCircle({ value, size = 140 }) {
  const r = (size - 14) / 2;
  const C = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(15,26,46,0.08)"
        strokeWidth={10}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#gradWinrate)"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={C}
        initial={{ strokeDashoffset: C }}
        animate={{ strokeDashoffset: C - (C * value) / 100 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <defs>
        <linearGradient id="gradWinrate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5C8BFA" />
          <stop offset="100%" stopColor="#2F6BF6" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0F1A2E"
        style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 32 }}
      >
        {value}%
      </text>
    </svg>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.v), 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
      {data.map((d, i) => {
        const pct = (d.v / max) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div className="w-full flex-1 flex items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ delay: i * 0.07, duration: 0.7, ease: 'easeOut' }}
                className="w-full rounded-t-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #3D78FF, #2563EB)',
                  minHeight: 6,
                  boxShadow: '0 4px 12px rgba(47,107,246,0.25)',
                }}
              >
                <span className="absolute inset-0 shimmer opacity-50" />
              </motion.div>
            </div>
            <span className="text-[10px] text-fg-muted font-semibold">{d.label}</span>
            <span className="text-[10px] text-fg font-bold">{d.v}</span>
          </div>
        );
      })}
    </div>
  );
}

function Donut({ segments, size = 120 }) {
  const r = (size - 14) / 2;
  const C = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(15,26,46,0.06)"
        strokeWidth={12}
        fill="none"
      />
      {segments.map((s, i) => {
        const length = (s.value / 100) * C;
        const offset = (cum / 100) * C;
        cum += s.value;
        return (
          <motion.circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={s.color}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${length} ${C}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -offset }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        );
      })}
    </svg>
  );
}

export function ProfilStats() {
  const stats = useStore((s) => s.user.stats);
  const historique = useStore((s) => s.historique);

  // Parties par mois (6 derniers mois) dérivées de l'historique réel.
  const months = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('fr', { month: 'short' }),
        v: 0,
      });
    }
    historique.forEach((h) => {
      const d = new Date(h.date);
      const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (b) b.v += 1;
    });
    return buckets;
  }, [historique]);

  // Modes préférés dérivés de l'historique réel.
  const modeStats = useMemo(() => {
    const counts = {};
    historique.forEach((h) => {
      counts[h.mode] = (counts[h.mode] || 0) + 1;
    });
    const total = historique.length || 1;
    return Object.entries(MODE_META).map(([mode, meta]) => ({
      mode,
      label: meta.label,
      color: meta.color,
      value: Math.round(((counts[mode] || 0) / total) * 100),
    }));
  }, [historique]);

  return (
    <PageTransition>
      <AppHeader title="Mes statistiques" />

      <div className="px-5 py-4 space-y-4">
        <div className="glass-card rounded-card p-5 relative overflow-hidden">
          <span className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative flex items-center gap-5">
            <WinrateCircle value={stats.winrate} />
            <div className="flex-1 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted font-bold">
                Winrate global
              </p>
              <div>
                <p className="font-mono font-bold text-emerald text-2xl tabular-nums">
                  {stats.victoires}
                </p>
                <p className="text-xs text-fg-muted">Victoires</p>
              </div>
              <div>
                <p className="font-mono font-bold text-rose text-2xl tabular-nums">
                  {stats.defaites}
                </p>
                <p className="text-xs text-fg-muted">Défaites</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-card p-4 relative overflow-hidden">
            <span className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-coral/20 blur-2xl" />
            <Flame className="h-5 w-5 text-coral mb-2 relative" />
            <p className="relative font-mono font-bold text-2xl text-fg tabular-nums">
              {stats.serieActuelle}
            </p>
            <p className="relative text-xs text-fg-muted">Série actuelle</p>
          </div>
          <div className="glass-card rounded-card p-4 relative overflow-hidden">
            <span className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-sky/20 blur-2xl" />
            <Target className="h-5 w-5 text-sky mb-2 relative" />
            <p className="relative font-mono font-bold text-2xl text-fg tabular-nums">
              {stats.parties}
            </p>
            <p className="relative text-xs text-fg-muted">Parties jouées</p>
          </div>
        </div>

        <div className="glass-card rounded-card p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-bold text-fg tracking-tight">Parties par mois</p>
            <TrendingUp className="h-4 w-4 text-emerald" />
          </div>
          <BarChart data={months} />
        </div>

        <div className="glass-card rounded-card p-4">
          <p className="font-display font-bold text-fg mb-4 tracking-tight">Modes préférés</p>
          <div className="flex items-center gap-5">
            <Donut segments={modeStats.map((m) => ({ value: m.value, color: m.color }))} />
            <ul className="flex-1 space-y-2.5 text-sm">
              {modeStats.map((m) => (
                <li key={m.mode} className="flex items-center gap-2 text-fg">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  {m.label}
                  <span className="ml-auto font-mono text-fg-muted font-bold">
                    {m.value}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
