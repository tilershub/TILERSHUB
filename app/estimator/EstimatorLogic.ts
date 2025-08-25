// EstimatorLogic.ts

export type Inputs = {
  area_sqft: number;
  tile_value: string;            // e.g., "600x600"
  tile_price_each: number;       // LKR per tile
  skirting_len_ft?: number;      // optional; default = ceil(20% of area)
  user_labor_rate_sqft?: number; // optional override
  wastage_pct?: number;          // optional; default 5
};

export type Report = {
  area_sqft: number;
  skirting_len_ft: number;
  tile_label: string;

  // Tile quantities
  floor_tiles: number;
  skirting_tiles: number;
  base_tiles: number;           // floor + skirting (before wastage)
  wastage_pct: number;
  wastage_tiles: number;        // ceil(base * pct)
  total_tiles: number;          // base + wastage

  // Costs (summary)
  materialsMin: number;
  materialsMax: number;
  laborMin: number;
  laborMax: number;
  totalMin: number;
  totalMax: number;

  // Tile cost breakdown
  tile_cost_per_piece: number;
  tile_cost_floor_only: number;   // floor_tiles * price
  tile_cost_skirting_only: number;// skirting_tiles * price
  tile_cost_wastage_only: number; // wastage_tiles * price
  tile_cost_total: number;        // total_tiles * price
};

type TileSize = {
  label: string;
  value: string;
  sqft: number;
  laborMin: number;
  laborMax: number;
  skirtingCoverage: number;
};

const PRICE = {
  cementBag50kg: 1900,
  sandCube: 25000,
  adhesive25kg: 2200,
  clipsPer100: 1500,
  groutPerKg: 300,
};

const safe = (n: unknown, fb = 0) => (Number.isFinite(Number(n)) ? Number(n) : fb);
const pos = (n: unknown, fb = 0) => {
  const v = safe(n, fb);
  return v > 0 ? v : fb;
};

export function computeReport(inp: Inputs, sizes: { tileSizes: TileSize[] }): Report {
  const selected = sizes.tileSizes.find(t => t.value === inp.tile_value) ?? sizes.tileSizes[0];
  if (!selected) throw new Error("No tile sizes found");

  const area = pos(inp.area_sqft, 0);
  if (area <= 0) throw new Error("Area must be > 0");

  const skirting = pos(inp.skirting_len_ft, Math.ceil(area * 0.2));
  const perTileSqft = pos(selected.sqft, 0);

  const floorTiles = perTileSqft > 0 ? Math.ceil(area / perTileSqft) : 0;
  const skirtingTiles = Math.ceil(skirting / Math.max(1, pos(selected.skirtingCoverage, 1)));

  const baseTiles = floorTiles + skirtingTiles;

  const wastage_pct = pos(inp.wastage_pct, 5); // default 5%
  const wastageTiles = Math.ceil(baseTiles * (wastage_pct / 100));
  const totalTiles = baseTiles + wastageTiles;

  const tilePriceEach = pos(inp.tile_price_each, 0);
  const tile_cost_floor_only = floorTiles * tilePriceEach;
  const tile_cost_skirting_only = skirtingTiles * tilePriceEach;
  const tile_cost_wastage_only = wastageTiles * tilePriceEach;
  const tile_cost_total = totalTiles * tilePriceEach;

  // Floor bed & consumables
  const cementMin = Math.ceil((8 * area) / 800);
  const cementMax = Math.ceil((8 * area) / 600);
  const cementMinCost = cementMin * PRICE.cementBag50kg;
  const cementMaxCost = cementMax * PRICE.cementBag50kg;

  const sandMin = Math.round((area / 800) * 4) / 4;
  const sandMax = Math.round((area / 600) * 4) / 4;
  const sandMinCost = sandMin * PRICE.sandCube;
  const sandMaxCost = sandMax * PRICE.sandCube;

  const adhesiveMin = Math.ceil(area / 40);
  const adhesiveMax = Math.ceil(area / 30);
  const adhesiveMinCost = adhesiveMin * PRICE.adhesive25kg;
  const adhesiveMaxCost = adhesiveMax * PRICE.adhesive25kg;

  const clips = Math.ceil(area / 100);
  const grout = Math.ceil(area / 175);
  const clipsCost = clips * PRICE.clipsPer100;
  const groutCost = grout * PRICE.groutPerKg;

  const materialsMin =
    tile_cost_total + cementMinCost + sandMinCost + adhesiveMinCost + clipsCost + groutCost;
  const materialsMax =
    tile_cost_total + cementMaxCost + sandMaxCost + adhesiveMaxCost + clipsCost + groutCost;

  // Labor
  let laborMin: number, laborMax: number;
  const userLabor = pos(inp.user_labor_rate_sqft, 0);
  if (userLabor > 0) {
    laborMin = laborMax = (area + skirting) * userLabor;
  } else {
    laborMin = area * selected.laborMin + skirting * selected.laborMin;
    laborMax = area * selected.laborMax + skirting * selected.laborMax;
  }

  const totalMin = materialsMin + laborMin;
  const totalMax = materialsMax + laborMax;

  return {
    area_sqft: area,
    skirting_len_ft: skirting,
    tile_label: selected.label,

    floor_tiles: floorTiles,
    skirting_tiles: skirtingTiles,
    base_tiles: baseTiles,
    wastage_pct,
    wastage_tiles: wastageTiles,
    total_tiles: totalTiles,

    materialsMin,
    materialsMax,
    laborMin,
    laborMax,
    totalMin,
    totalMax,

    tile_cost_per_piece: tilePriceEach,
    tile_cost_floor_only,
    tile_cost_skirting_only,
    tile_cost_wastage_only,
    tile_cost_total,
  };
}