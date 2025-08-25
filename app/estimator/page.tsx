'use client';
import { useMemo, useRef, useState } from 'react';
import sizes from './tile-sizes.json'; // { tileSizes: [...] }
import type { Inputs, Report } from './EstimatorLogic';
import { computeReport } from './EstimatorLogic';

export default function Estimator(){
  const firstValue = (sizes as any)?.tileSizes?.[0]?.value ?? '';
  const [inp, setInp] = useState<Inputs>({
    area_sqft: 0,
    tile_value: firstValue,
    tile_price_each: 0,
    skirting_len_ft: undefined,        // optional; defaults to ceil(20% of area)
    user_labor_rate_sqft: undefined,   // optional override
    // wastage_pct: 5,                  // uncomment to expose/override default 5%
  });

  const rep: Report | null = useMemo(() => {
    try { return computeReport(inp, sizes as any); } catch { return null; }
  }, [inp]);

  const onNum = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInp(v => ({ ...v, [k]: +e.target.value || 0 }));

  const onMaybe = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInp(v => {
      const n = +e.target.value;
      return { ...v, [k]: Number.isFinite(n) ? n : undefined };
    });

  const reportRef = useRef<HTMLDivElement>(null);

  async function downloadPDF(){
    const [{ default: jsPDF }, html2canvas] = await Promise.all([ import('jspdf'), import('html2canvas') ]);
    const node = reportRef.current; if (!node) return;
    const canvas = await html2canvas.default(node, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const w = canvas.width * ratio; const h = canvas.height * ratio;
    const x = (pageWidth - w) / 2; const y = 24;
    pdf.addImage(imgData, 'PNG', x, y, w, h, undefined, 'FAST');
    pdf.save('tilershub-estimate.pdf');
  }

  return (
    <main className="home">
      <h1>Floor Tiling Estimator</h1>

      {/* INPUTS */}
      <section className="section card">
        <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))'}}>
          <div>
            <label>Area (sqft)</label>
            <input type="number" inputMode="decimal" value={inp.area_sqft ?? ''} onChange={onNum('area_sqft')} placeholder="e.g., 300" />
          </div>
          <div>
            <label>Tile Size</label>
            <select value={inp.tile_value} onChange={e=>setInp(v=>({...v, tile_value: e.target.value}))}>
              {(sizes as any).tileSizes.map((s:any)=>(
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Tile Price (LKR / TILE)</label>
            <input type="number" inputMode="decimal" value={inp.tile_price_each ?? ''} onChange={onNum('tile_price_each')} placeholder="e.g., 450" />
          </div>
          <div>
            <label>Skirting Length (ft) <span style={{color:'var(--muted)'}}>(optional)</span></label>
            <input type="number" inputMode="decimal" value={inp.skirting_len_ft ?? ''} onChange={onMaybe('skirting_len_ft')} placeholder="auto = 20% of area" />
          </div>
          <div>
            <label>Labor Rate (LKR / sqft) <span style={{color:'var(--muted)'}}>(optional override)</span></label>
            <input type="number" inputMode="decimal" value={inp.user_labor_rate_sqft ?? ''} onChange={onMaybe('user_labor_rate_sqft')} placeholder="e.g., 140" />
          </div>
          {/* Optional: expose wastage override
          <div>
            <label>Wastage (%)</label>
            <input type="number" inputMode="decimal" value={inp.wastage_pct ?? ''} onChange={onMaybe('wastage_pct')} placeholder="default 5%" />
          </div>
          */}
        </div>

        <div style={{marginTop:12, display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
          <button className="btn" onClick={()=>window.print()}>Print</button>
          <button className="btn-primary" onClick={downloadPDF} disabled={!rep}>Download PDF</button>
        </div>
      </section>

      {/* REPORT */}
      <section className="section card" ref={reportRef}>
        <h2 style={{marginTop:0}}>Report</h2>

        {!rep ? (
          <p style={{opacity:.7}}>Enter area, tile size, and price per tile to see the report.</p>
        ) : (
          <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))'}}>
            {/* Summary */}
            <div className="card" style={{boxShadow:'none', padding:0}}>
              <h3>📌 Project Summary</h3>
              <table className="table"><tbody>
                <tr><td>Area</td><td><b>{rep.area_sqft}</b> sqft</td></tr>
                <tr><td>Skirting</td><td><b>{rep.skirting_len_ft}</b> ft</td></tr>
                <tr><td>Tile Size</td><td><b>{rep.tile_label}</b></td></tr>
                <tr><td>Total Tiles</td><td><b>{rep.total_tiles}</b></td></tr>
              </tbody></table>
            </div>

            {/* Tiling Estimate (with explicit wastage) */}
            <div className="card" style={{boxShadow:'none', padding:0}}>
              <h3>🧱 Tiling Estimate</h3>
              <table className="table"><tbody>
                <tr>
                  <td>Floor Tiles</td>
                  <td><b>{rep.floor_tiles}</b></td>
                  <td>LKR {rep.tile_cost_floor_only.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Skirting Tiles</td>
                  <td><b>{rep.skirting_tiles}</b></td>
                  <td>LKR {rep.tile_cost_skirting_only.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Base Tiles (before wastage)</td>
                  <td><b>{rep.base_tiles}</b></td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Wastage ({rep.wastage_pct}%)</td>
                  <td><b>{rep.wastage_tiles}</b></td>
                  <td>LKR {rep.tile_cost_wastage_only.toLocaleString()}</td>
                </tr>
                <tr>
                  <td><b>Total Tiles</b></td>
                  <td><b>{rep.total_tiles}</b></td>
                  <td><b>LKR {rep.tile_cost_total.toLocaleString()}</b></td>
                </tr>
                <tr><td colSpan={3}><hr/></td></tr>
                <tr>
                  <td>Adhesive (25kg)</td>
                  <td>{rep.materials.adhesiveMin_bags} – {rep.materials.adhesiveMax_bags}</td>
                  <td>LKR {rep.materials.adhesiveMin_cost.toLocaleString()} – {rep.materials.adhesiveMax_cost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Clips (100 pcs)</td>
                  <td>{rep.materials.clips_qty}</td>
                  <td>LKR {rep.materials.clips_cost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Grout (1kg)</td>
                  <td>{rep.materials.grout_kg}</td>
                  <td>LKR {rep.materials.grout_cost.toLocaleString()}</td>
                </tr>
              </tbody></table>
            </div>

            {/* Floor Bed Estimate */}
            <div className="card" style={{boxShadow:'none', padding:0}}>
              <h3>🧱 Floor Bed Estimate</h3>
              <table className="table"><tbody>
                <tr>
                  <td>Cement (50kg)</td>
                  <td>{rep.materials.cementMin_bags} – {rep.materials.cementMax_bags}</td>
                  <td>LKR {rep.materials.cementMin_cost.toLocaleString()} – {rep.materials.cementMax_cost.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Sand (1 cube)</td>
                  <td>{rep.materials.sandMin_cubes} – {rep.materials.sandMax_cubes}</td>
                  <td>LKR {rep.materials.sandMin_cost.toLocaleString()} – {rep.materials.sandMax_cost.toLocaleString()}</td>
                </tr>
              </tbody></table>
            </div>

            {/* Labor */}
            <div className="card" style={{boxShadow:'none', padding:0}}>
              <h3>👷 Labor Cost</h3>
              <table className="table"><tbody>
                <tr><td>Floor Labor</td><td>LKR {rep.labor.floorLaborMin.toFixed(0)}</td><td>LKR {rep.labor.floorLaborMax.toFixed(0)}</td></tr>
                <tr><td>Skirting Labor</td><td>LKR {rep.labor.skirtingLaborMin.toFixed(0)}</td><td>LKR {rep.labor.skirtingLaborMax.toFixed(0)}</td></tr>
                <tr><td><b>Total Labor</b></td><td><b>LKR {rep.labor.laborMin.toFixed(0)}</b></td><td><b>LKR {rep.labor.laborMax.toFixed(0)}</b></td></tr>
              </tbody></table>
            </div>

            {/* Totals */}
            <div className="card" style={{boxShadow:'none', padding:0}}>
              <h3>💰 Total Cost Estimate</h3>
              <table className="table"><tbody>
                <tr><td>Materials</td><td colSpan={2}><b>LKR {rep.materialsMin.toLocaleString()} – {rep.materialsMax.toLocaleString()}</b></td></tr>
                <tr><td>Labor</td><td colSpan={2}><b>LKR {rep.laborMin.toLocaleString()} – {rep.laborMax.toLocaleString()}</b></td></tr>
                <tr><td>Total</td><td colSpan={2}><b>LKR {rep.totalMin.toLocaleString()} – {rep.totalMax.toLocaleString()}</b></td></tr>
              </tbody></table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}