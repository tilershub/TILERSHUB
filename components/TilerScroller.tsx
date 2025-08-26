import Image from 'next/image';

export type Tiler = {
  id: string;
  name: string;
  location: string;
  rating: number;
  jobsCompleted: number;
  avatar: string;
  badges?: string[];
  tags?: string[];
  profileHref?: string;
  quoteHref?: string;
};

export default function TilerScroller({ tilers }: { tilers: Tiler[] }) {
  const stars = (r:number) => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(r), 10 - Math.round(r));

  return (
    <section aria-label="Top tilers" className="mt-4">
      <h2 className="mx-1 mb-2 text-xl font-semibold">Top Tilers</h2>

      {tilers.map(t => (
        <article key={t.id}
          className="grid grid-cols-[108px_1fr] gap-4 bg-white border border-slate-200 rounded-2xl shadow-md p-4 my-5">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-200">
            <Image src={t.avatar} alt={t.name} fill className="object-cover" />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <div className="flex items-center gap-2 text-slate-900" aria-label={`${t.rating} stars, ${t.jobsCompleted} jobs`}>
                <span className="tracking-[2px] text-sm opacity-75">{stars(t.rating)}</span>
                <span className="font-extrabold">{t.rating.toFixed(1)}</span>
                <span className="text-slate-500">{t.jobsCompleted} jobs</span>
              </div>
            </div>

            <div className="text-slate-500 mt-1 mb-2">{t.location}</div>

            {!!t.badges?.length && (
              <div className="flex flex-wrap gap-2 mb-2">
                {t.badges.map(b => (
                  <span key={b} className="text-xs font-bold px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-900">
                    {b}
                  </span>
                ))}
              </div>
            )}

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
