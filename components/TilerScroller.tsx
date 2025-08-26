import Image from 'next/image';

export type Tiler = {
  id: string;
  name: string;
  location: string;
  rating: number;         // 0–5
  jobsCompleted: number;
  avatar: string;
  badge?: 'TILERSHUB Certified' | 'Certified Tiler' | 'Professional Tiler' | 'Master Tiler' | string;
  tags?: string[];
  profileHref?: string;
  quoteHref?: string;
};

export default function TilerScroller({ tilers }: { tilers: Tiler[] }) {
  const stars = (r:number) => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(r), 10 - Math.round(r));

  const badgeStyle = (label?: string) => {
    switch (label) {
      case 'Master Tiler':
        return 'border-purple-200 bg-purple-50 text-purple-900';
      case 'Professional Tiler':
        return 'border-emerald-200 bg-emerald-50 text-emerald-900';
      case 'Certified Tiler':
        return 'border-amber-200 bg-amber-50 text-amber-900';
      case 'TILERSHUB Certified':
        return 'border-blue-200 bg-blue-50 text-blue-900';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  const BadgeIcon = ({ label }: { label?: string }) => {
    // pick an icon per badge label
    const cn = 'w-3.5 h-3.5';
    switch (label) {
      case 'Master Tiler':
        // crown
        return (
          <svg viewBox="0 0 24 24" className={cn} aria-hidden="true" fill="currentColor">
            <path d="M5 18h14l1-9-5 3-3-5-3 5-5-3 1 9Zm-1 2a1 1 0 0 1-1-1l-1-10a1 1 0 0 1 1.5-.9l5.1 3.06 2.45-4.07a1 1 0 0 1 1.7 0l2.45 4.07L21.5 8.1a1 1 0 0 1 1.5.9l-1 10a1 1 0 0 1-1 1H4Z"/>
          </svg>
        );
      case 'Professional Tiler':
        // briefcase
        return (
          <svg viewBox="0 0 24 24" className={cn} aria-hidden="true" fill="currentColor">
            <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v4h-6v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H1V8a2 2 0 0 1 2-2h4V4Zm2 2h2V4h-2v2ZM1 14h22v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4Z"/>
          </svg>
        );
      case 'Certified Tiler':
      case 'TILERSHUB Certified':
        // shield-check
        return (
          <svg viewBox="0 0 24 24" className={cn} aria-hidden="true" fill="currentColor">
            <path d="M12 2 4 5v6c0 5.55 3.84 8.74 7.19 9.84.52.17 1.1.17 1.62 0C16.16 19.74 20 16.55 20 11V5l-8-3Zm-1 14-3.5-3.5 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 7Z"/>
          </svg>
        );
      default:
        // tag
        return (
          <svg viewBox="0 0 24 24" className={cn} aria-hidden="true" fill="currentColor">
            <path d="M10.59 2.59 3 10.17V21h10.83l7.59-7.59a2 2 0 0 0 0-2.83l-6.99-6.99a2 2 0 0 0-2.84 0ZM7 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          </svg>
        );
    }
  };

  return (
    <section aria-label="Top tilers" className="mt-4">
      <h2 className="mx-1 mb-2 text-xl font-semibold">Top Tilers</h2>

      {tilers.map(t => (
        <article key={t.id}
          className="grid grid-cols-[108px_1fr] gap-4 bg-white border border-slate-200 rounded-2xl shadow-md p-4 my-5">
          
          {/* LEFT: avatar + stats + badge */}
          <div className="flex flex-col items-center">
            <div className="relative w-[108px] aspect-square rounded-xl overflow-hidden bg-slate-200">
              <Image src={t.avatar} alt={t.name} fill className="object-cover" />
            </div>

            <div className="mt-2 flex flex-col items-center leading-tight">
              <div className="tracking-[2px] text-sm opacity-75">
                {stars(t.rating)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold">{t.rating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">{t.jobsCompleted} jobs</span>
              </div>
            </div>

            {t.badge && (
              <span
                className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeStyle(t.badge)}`}
                aria-label={t.badge}
                title={t.badge}
              >
                <BadgeIcon label={t.badge} />
                {t.badge}
              </span>
            )}
          </div>

          {/* RIGHT: details */}
          <div>
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <div className="text-slate-500 mt-1 mb-2">{t.location}</div>

            {!!t.tags?.length && (
              <div className="flex flex-wrap gap-2 mb-3">
                {t.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-slate-50">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {t.profileHref && (
                <a href={t.profileHref} className="px-3 py-2 rounded-xl border border-slate-300">
                  View Profile
                </a>
              )}
              {t.quoteHref && (
                <a href={t.quoteHref} className="px-3 py-2 rounded-xl bg-[#003049] text-white font-extrabold">
                  Request Quote
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}