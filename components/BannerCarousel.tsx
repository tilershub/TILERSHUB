'use client';
import Image from 'next/image';
import styles from './BannerCarousel.module.css';
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
  const snap = (dir:-1|1) => scroller.current?.scrollBy({left:dir*(scroller.current.clientWidth),behavior:'smooth'});

  return (
    <section className={styles.wrap} aria-label="Promotion banners">
      <div className={styles.scroller} ref={scroller}>
        {slides.map(s=>(
          <div key={s.id} className={styles.slide}>
            <Image src={s.image} alt={s.title ?? 'Promotion'} fill priority />
            {(s.title||s.subtitle||s.ctaLabel)&&(
              <div className={styles.overlay}>
                {s.title && <h2>{s.title}</h2>}
                {s.subtitle && <p>{s.subtitle}</p>}
                {s.ctaLabel && s.ctaHref && <a className={styles.cta} href={s.ctaHref}>{s.ctaLabel}</a>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button onClick={()=>snap(-1)} aria-label="Previous">‹</button>
        <button onClick={()=>snap(1)} aria-label="Next">›</button>
      </div>
    </section>
  );
}