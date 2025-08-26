'use client';
import Image from 'next/image';
import { useRef } from 'react';

export type ServiceBanner = {
  id: string;
  title: string;
  subline?: string;
  image: string;
  href?: string;
};

export default function ServiceScroller({ services }: { services: ServiceBanner[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const snap = (dir:-1|1)=> scroller.current?.scrollBy({ left: dir*(scroller.current.clientWidth), behavior:'smooth' });

  return (
    <section className="relative mt-4">
      <div
        ref={scroller}
        className="grid grid-flow-col auto-cols-[100%] overflow-x-auto snap-x snap-mandatory gap-3 rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map(s => (
          <a key={s.id} href={s.href ?? '#'} className="relative h-[min(40vw,360px)] snap-start rounded-2xl overflow-hidden bg-slate-100">
            <Image src={s.image} alt={s.title} fill className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black/45 to-transparent">
              <h3 className="text-[clamp(18px,2.6vw,24px)] font-semibold">{s.title}</h3>
              {s.subline && <p className="opacity-90">{s.subline}</p>}
            </div>
          </a>
        ))}
      </div>

      <div className="absolute right-2 bottom-2 flex gap-2">
        <button onClick={()=>snap(-1)} aria-label="Previous" className="w-9 h-9 rounded-full bg-white shadow-md">‹</button>
        <button onClick={()=>snap(1)} aria-label="Next" className="w-9 h-9 rounded-full bg-white shadow-md">›</button>
      </div>
    </section>
  );
}
