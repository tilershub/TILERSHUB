'use client';
import Image from 'next/image';
import { useRef } from 'react';

export type Promo = {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function BannerCarousel({ slides }: { slides: Promo[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const snap = (dir: -1 | 1) =>
    scroller.current?.scrollBy({ left: dir * (scroller.current.clientWidth), behavior: 'smooth' });

  return (
    <section className="relative edge-mobile">{/* <-- full-bleed on mobile */}
      <div
        ref={scroller}
        className="grid grid-flow-col auto-cols-[100%] overflow-x-auto scroll-smooth snap-x snap-mandatory
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map(s => (
          <div
            key={s.id}
            className="relative h-[min(46vw,420px)] snap-start overflow-hidden bg-slate-100 rounded-xl sm:rounded-2xl"
          >
            <Image src={s.image} alt={s.title ?? 'Promotion'} fill priority className="object-cover" />
            {(s.title || s.subtitle || s.ctaLabel) && (
              <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black/50 to-transparent">
                {s.title && <h2 className="text-[clamp(18px,3vw,28px)] font-semibold">{s.title}</h2>}
                {s.subtitle && <p className="opacity-90">{s.subtitle}</p>}
                {s.ctaLabel && s.ctaHref && (
                  <a href={s.ctaHref} className="inline-block mt-2 bg-white text-slate-900 font-extrabold px-4 py-2 rounded-xl">
                    {s.ctaLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute right-2 bottom-2 flex gap-2">
        <button onClick={() => snap(-1)} aria-label="Previous" className="w-8 h-8 rounded-full bg-white shadow">‹</button>
        <button onClick={() => snap(1)} aria-label="Next" className="w-8 h-8 rounded-full bg-white shadow">›</button>
      </div>
    </section>
  );
}