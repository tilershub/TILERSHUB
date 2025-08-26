'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on ESC + lock body scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.toggle('overflow-hidden', open);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  // Close when clicking backdrop
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wide text-slate-900">
          TILERSHUB
        </Link>

        {/* Desktop nav (optional) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/tilers" className="hover:underline">Tilers</Link>
          <Link href="/estimator" className="px-3 py-2 rounded-xl bg-[#003049] text-white font-extrabold">
            Get an Estimate
          </Link>
        </nav>

        {/* Hamburger (mobile) */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="text-2xl px-2 md:hidden"
          onClick={() => setOpen(true)}
        >
          ≡
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onBackdropClick}
        >
          <div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="ml-auto h-full w-72 bg-white shadow-xl p-4 flex flex-col gap-3 animate-[slideIn_.2s_ease-out]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold tracking-wide text-slate-900">Menu</span>
              <button
                aria-label="Close menu"
                className="text-2xl px-2"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <Link href="/" className="py-2 border-b border-slate-100" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/services" className="py-2 border-b border-slate-100" onClick={() => setOpen(false)}>
              Services
            </Link>
            <Link href="/tilers" className="py-2 border-b border-slate-100" onClick={() => setOpen(false)}>
              Tilers
            </Link>
            <Link href="/estimator" className="py-2 border-b border-slate-100" onClick={() => setOpen(false)}>
              Get an Estimate
            </Link>
            <Link href="/contact" className="py-2" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <div className="mt-auto pt-3">
              <a
                href="https://wa.me/94774503744"
                className="block text-center px-4 py-3 rounded-xl bg-[#003049] text-white font-extrabold"
                onClick={() => setOpen(false)}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* tiny keyframe for smooth slide-in */}
      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity:.6 } to { transform: translateX(0); opacity:1 } }
      `}</style>
    </header>
  );
}