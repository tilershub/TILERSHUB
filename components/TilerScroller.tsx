import Image from 'next/image';
import styles from './TilerScroller.module.css';

export type Tiler = {
  id: string;
  name: string;
  location: string;
  rating: number;         // 0–5
  jobsCompleted: number;  // show with rating
  avatar: string;
  badges?: string[];
  tags?: string[];
  profileHref?: string;
  quoteHref?: string;
};

export default function TilerScroller({ tilers }: { tilers: Tiler[] }) {
  return (
    <section className={styles.wrap} aria-label="Top tilers">
      <h2 className={styles.title}>Top Tilers</h2>
      {tilers.map(t=>(
        <article key={t.id} className={styles.card}>
          <div className={styles.avatar}>
            <Image src={t.avatar} alt={t.name} fill />
          </div>

          <div className={styles.main}>
            <div className={styles.row1}>
              <h3 className={styles.name}>{t.name}</h3>
              <div className={styles.rating} aria-label={`${t.rating} stars, ${t.jobsCompleted} jobs completed`}>
                <span className={styles.stars}>{'★★★★★☆☆☆☆☆'.slice(5 - Math.round(t.rating), 10 - Math.round(t.rating))}</span>
                <span className={styles.score}>{t.rating.toFixed(1)}</span>
                <span className={styles.jobs}>{t.jobsCompleted} jobs</span>
              </div>
            </div>

            <div className={styles.meta}>{t.location}</div>

            {!!t.badges?.length && (
              <div className={styles.badges}>{t.badges.map(b=><span key={b} className={styles.badge}>{b}</span>)}</div>
            )}

            {!!t.tags?.length && (
              <div className={styles.tags}>{t.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
            )}

            <div className={styles.actions}>
              {t.profileHref && <a className={styles.btnOutline} href={t.profileHref}>View Profile</a>}
              {t.quoteHref && <a className={styles.btnPrimary} href={t.quoteHref}>Request Quote</a>}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}