'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wide text-slate-900">
          TILERSHUB
        </Link>
        <button aria-label="Open menu" className="text-2xl px-2">≡</button>
      </div>
    </header>
  );
}
