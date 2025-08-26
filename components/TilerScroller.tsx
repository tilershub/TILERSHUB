import Image from 'next/image';

export type Tiler = {
  id: string;
  name: string;
  location: string;
  rating: number;         // 0–5
  jobsCompleted: number;
  avatar: string;
  badges?: string[];
  tags?: string[];
  profileHref?: string;
  quoteHref?: string;
};

export default function TilerScroller({ tilers }: { tilers: Tiler[] }) {
  const stars = (r:number) => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(r), 10 - Math.round(r));

  const primaryBadge = (badges?: string[]) => (badges && badges.length ? badges[0] : undefined);
  const extraBadges  = (badges?: string[]) => (badges && badges.length > 1 ? badges.slice(1) : []);

  const badgeTone = (label?: string) => {
    switch (label) {
      case 'Master Tiler':         return 'border-purple-200 bg-purple-50 text-purple-900';
      case 'Professional Tiler':   return 'border-emerald-200 bg-emerald-50 text-emerald-900';
      case 'Certified Tiler':      return 'border-amber-200 bg-amber-50 text-amber-900';
      case 'Verified Tiler':       return 'border-blue-200 bg-blue-50 text-blue-900';
      default:                     return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  const BadgeIcon = ({ label }: { label?: string }) => {
    const cn = 'w-3.5 h-3.5';
    switch (label) {
      case 'Master Tiler':
        return (<svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true"><path d="M5 18h14l1-9-5 3-3-5-3 5-5-3 1 9Zm-1 2a1 1 0 0 1-1-1l-1-10a1 1 0 0 1 1.5-.9l5.1 3.06 2.45-4.07a1 1 0 0 1 1.7 0l2.45 4.07L21.5 8.1a1 1 0 0 1 1.5.9l-1 10a1 1 0 0 1-1 1H4Z"/></svg>);
      case 'Professional Tiler':
        return (<svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true"><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v4h-6v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H1V8a2 2 0 0 1 2-2h4V4Zm2 2h2V4h-2v2ZM1 14h22v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4Z"/></svg>);
      case 'Certified Tiler':
        return (<svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true"><path d="M12 2 4 5v6c0 5.55 3.84 8.74 7.19 9.84.52.17 1.1.17 1.62 0C16.16 19.74 20 16.55 20 11V5l-8-3Zm-1 14-3.5-3.5 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 7Z"/></svg>);
      case 'Verified Tiler':
        return (<svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>);
      default:
        return (<svg viewBox="0 0 24 24" className={cn} fill="currentColor" aria-hidden="true"><path d="M10.59 2.59 3 10.17V21h10.83l7.59-7.59a2 2 0 0 0 0-2.83l-6.99-6.99a2 2 0 0 0-2.84 0ZM7 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>);
    }
  };

  return (
    <section aria-label="Top tilers" className="mt-4">
      <h2 className="mx-1 mb-2 text-xl font-semibold">Top Tilers</h2>

      {tilers.map(t => {
        const main = primaryBadge(t.badges);
        const rest = extraBadges(t.badges);

        return (
          <article
            key={t.id}
            className="tiler-card grid grid-cols-[96px_1fr] gap-3 bg-white p-3 my-3"
          >
            {/* LEFT: avatar + stats + primary badge */}
            <div className="flex flex-col items-center">
              <div className="relative w-[96px] aspect-square rounded-lg overflow-hidden bg-slate-200">
                <Image src={t.avatar} alt={t.name} fill className="object-cover" />
              </div>

              <div className="mt-2 flex flex-col items-center leading-tight">
                <div className="tracking-[1.5px] text-xs opacity-75">{stars(t.rating)}</div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold">{t.rating.toFixed(1)}</span>
                  <span className="text-slate-500 text-[13px]">{t.jobsCompleted} jobs</span>
                </div>
              </div>

              {main && (
                <span
                  className={`chip-tight inline-flex items-center gap-1.5 rounded-full border ${badgeTone(main)}`}
                  aria-label={main}
                  title={main}
                >
                  <BadgeIcon label={main} />
                  {main}
                </span>
              )}
            </div>

            {/* RIGHT */}
            <div>
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="text-slate-500 mt-1 mb-2">{t.location}</div>

              {!!rest.length && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {rest.map(b => (
                    <span key={b} className={`chip-tight inline-flex items-center gap-1.5 rounded-full border ${badgeTone(b)}`}>
                      <BadgeIcon label={b} />
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {!!t.tags?.length && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {t.tags.map(tag => (
                    <span key={tag} className="chip-tight text-xs rounded-full border border-slate-200 bg-slate-50">
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
        );
      })}
    </section>
  );
}