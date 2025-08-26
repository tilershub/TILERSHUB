export default function Footer() {
  return (
    <footer className="mt-6 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-[1100px] px-4 py-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <strong>About</strong>
          <p className="opacity-80">Sri Lanka’s trusted tilers marketplace.</p>
        </div>
        <div>
          <strong>Contact</strong>
          <p className="opacity-80">0774503744 • tilershub.lk • Gampaha</p>
        </div>
        <div>
          <strong>Quick Links</strong>
          <p><a className="text-slate-300" href="/privacy">Privacy</a> · <a className="text-slate-300" href="/terms">Terms</a></p>
        </div>
        <div>
          <strong>Social</strong>
          <p><a className="text-slate-300" href="#">Facebook</a> · <a className="text-slate-300" href="#">WhatsApp</a> · <a className="text-slate-300" href="#">TikTok</a></p>
        </div>
      </div>
    </footer>
  );
}
