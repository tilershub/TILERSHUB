'use client';
import Image from 'next/image';
import styles from './ServiceScroller.module.css';
import { useRef } from 'react';

export type ServiceBanner = {
  id: string;
  title: string;
  subline?: string;
  image: string;   // big cover
  href?: string;
};

export default function ServiceScroller({ services }: { services: ServiceBanner[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const snap = (dir:-1|1)=>scroller.current?.scrollBy({left:dir*(scroller.current.clientWidth),behavior:'smooth'});

  return (
    <section className={styles.wrap} aria-label="Services">
      <div className={styles.scroller} ref={scroller}>
        {services.map(s=>(
          <a key={s.id} href={s.href ?? '#'} className={styles.card}>
            <Image src={s.image} alt={s.title} fill />
            <div className={styles.overlay}>
              <h3>{s.title}</h3>
              {s.subline && <p>{s.subline}</p>}
            </div>
          </a>
        ))}
      </div>
      <div className={styles.controls}>
        <button onClick={()=>snap(-1)} aria-label="Previous">‹</button>
        <button onClick={()=>snap(1)} aria-label="Next">›</button>
      </div>
    </section>
  );
}