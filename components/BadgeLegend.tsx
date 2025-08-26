export default function BadgeLegend() {
  const Item = ({
    color,
    label,
    desc,
    icon,
  }: {
    color: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }) => (
    <li
      className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}
      aria-label={`${label}: ${desc}`}
    >
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70">
        {icon}
      </span>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </li>
  );

  const icon = (path: 'crown' | 'briefcase' | 'shield' | 'check') => {
    const cn = 'w-4 h-4';
    switch (path) {
      case 'crown':
        return (
          <svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true">
            <path d="M5 18h14l1-9-5 3-3-5-3 5-5-3 1 9Zm-1 2a1 1 0 0 1-1-1l-1-10a1 1 0 0 1 1.5-.9l5.1 3.06 2.45-4.07a1 1 0 0 1 1.7 0l2.45 4.07L21.5 8.1a1 1 0 0 1 1.5.9l-1 10a1 1 0 0 1-1 1H4Z"/>
          </svg>
        );
      case 'briefcase':
        return (
          <svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true">
            <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v4h-6v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H1V8a2 2 0 0 1 2-2h4V4Zm2 2h2V4h-2v2ZM1 14h22v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4Z"/>
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true">
            <path d="M12 2 4 5v6c0 5.55 3.84 8.74 7.19 9.84.52.17 1.1.17 1.62 0C16.16 19.74 20 16.55 20 11V5l-8-3Zm-1 14-3.5-3.5 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 7Z"/>
          </svg>
        );
      case 'check':
        return (
          <svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true">
            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
    }
  };

  return (
    <section aria-labelledby="badge-legend-title" className="mt-6">
      <h3 id="badge-legend-title" className="section-title text-lg mb-2">Tiler Badge Levels</h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        <Item
          color="border-purple-200 bg-purple-50 text-purple-900"
          label="Master Tiler"
          desc="Highest skill & consistent 5★ results."
          icon={icon('crown')}
        />
        <Item
          color="border-emerald-200 bg-emerald-50 text-emerald-900"
          label="Professional Tiler"
          desc="Experienced pro with strong track record."
          icon={icon('briefcase')}
        />
        <Item
          color="border-amber-200 bg-amber-50 text-amber-900"
          label="Certified Tiler"
          desc="Meets TILERSHUB certification standards."
          icon={icon('shield')}
        />
        <Item
          color="border-blue-200 bg-blue-50 text-blue-900"
          label="Verified Tiler"
          desc="Identity & business verified by TILERSHUB."
          icon={icon('check')}
        />
      </ul>
    </section>
  );
}