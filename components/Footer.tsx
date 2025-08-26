export default function Footer() {
  return (
    <footer style={{marginTop:24, background:'#0f172a', color:'#e5e7eb'}}>
      <div style={{maxWidth:1100, margin:'0 auto', padding:16, display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
        <div>
          <strong>About</strong>
          <p>Sri Lanka’s trusted tilers marketplace.</p>
        </div>
        <div>
          <strong>Contact</strong>
          <p>0774503744 • tilershub.lk • Gampaha</p>
        </div>
        <div>
          <strong>Quick Links</strong>
          <p><a href="/privacy" style={{color:'#cbd5e1'}}>Privacy</a> · <a href="/terms" style={{color:'#cbd5e1'}}>Terms</a></p>
        </div>
        <div>
          <strong>Social</strong>
          <p><a href="#" style={{color:'#cbd5e1'}}>Facebook</a> · <a href="#" style={{color:'#cbd5e1'}}>WhatsApp</a> · <a href="#" style={{color:'#cbd5e1'}}>TikTok</a></p>
        </div>
      </div>
    </footer>
  );
}