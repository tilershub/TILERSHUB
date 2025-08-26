'use client';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>TILERSHUB</Link>
        <button className={styles.menu} aria-label="Open menu">≡</button>
      </div>
    </header>
  );
}