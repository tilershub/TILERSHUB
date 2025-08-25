// EstimatorLogic.ts

export type Inputs = {
  area_sqft: number;            // REQUIRED: total area in sqft
  tile_value: string;           // matches tile-sizes.json `value` (e.g., "600x600")
  tile_price_each: number;      // LKR per TILE
  skirting_len_ft?: number;     // optional; defaults to ceil(20% of area)
  user_labor_rate_sqft?: number;// optional; overrides min/max if > 0
};

export type TileSize = {
  label: string;
  value: string;
  width: number;           // inches (display only)
  height: number;          // inches (display only)
  sqft: number;            // sqft per tile
  laborMin: number;        // LKR / sqft
  laborMax: number;        // LKR / sqft
  skirtingCoverage: number;// linear ft covered by one tile as skirting
};

export type MaterialBreakdown = {
  cementMin_bags: number; cementMax_bags: number;
  cementMin_cost: number; cementMax_cost: number;
  sandMin_cubes: number;  sandMax_cubes: number;
  sandMin_cost: number;   sandMax_cost: number;
  adhesiveMin_bags: number; adhesiveMax_bags: number;
  adhesiveMin_cost: number; adhesiveMax_cost: number;
  clips_qty: number; clips_cost: number;
  grout_kg: number; grout_cost: number;
  tiles_floor_qty: number;
  tiles_skirting_qty: number;
  tiles_wastage_qty: number;   // <-- NEW (5% of base tiles)
  tiles_total_qty: number;
  tiles_cost: number;
};

export type LaborBreakdown = {
  floorLaborMin: number; floorLaborMax: number;
  skirtingLaborMin: number; skirtingLaborMax: number;
  laborMin: number; laborMax: number;
};

export type Report = {
  // Summary
  area_sqft: number;
  skirting_len_ft: number;
  tile_label: string;
  tile_value: string;

  // Quantities
  floor_tiles: number;
  skirting_tiles: number;
  wastage_tiles: number;   // <-- NEW
  total_tiles: number;

  // Costs (ranges)
  materialsMin: number; materialsMax: number;
  laborMin: number;      laborMax: number;
  totalMin: number;      totalMax: number;

  // Detailed
  materials: MaterialBreakdown;
  labor: LaborBreakdown;
};

// Tunable prices (LKR)
const PRICE = {
  cementBag50kg: 1900,
  sandCube: 25000,
  adhesive25kg: 2200,
  clipsPer100: 1500,
  groutPerKg: 300,
};

const safe = (n: unknown, fb = 0) => (Number.isFinite(Number(n)) ? Number(n) : fb);
const pos = (n: unknown, fb = 0) => { const v = safe(n, fb); return v > 0 ? v : fb; };

export function computeReport(inp: Inputs, sizes: { tileSizes: TileSize[] }): Report {
  const all = sizes?.tileSizes ?? [];
  const selected = all.find(t => t.value === inp.tile_value) ?? all[0];
  if (!selected) throw new Error('No tile sizes available.');

  const area = +pos(inp.area_sqft, 0).toFixed(2);
  if (area <= 0) throw new Error('Area (sqft) must be > 0.');

  // Skirting default (20% of area) if not provided
  const userSkirting = pos(inp.skirting_len_ft, NaN);
  const skirting_len_ft =
    Number.isFinite(userSkirting) && userSkirting > 0 ? Math.ceil(userSkirting) : Math.ceil(area * 0.2);

  // Tile counts
  const perTileSqft = pos(selected.sqft, 0);
  const floorTiles   = perTileSqft > 0 ? Math.ceil(area / perTileSqft) : 0;
  const skirtingCov  = Math.max(1, pos(selected.skirtingCoverage, 1));
  const skirtingTiles = Math.ceil(skirting_len_ft / skirtingCov);
  const baseTiles     = floorTiles + skirtingTiles;
  const wastageTiles  = Math.ceil(baseTiles * 0.05);        // 5% wastage (explicit)
  const totalTiles    = baseTiles + wastageTiles;

  // Tile cost is per TILE
  const tilePriceEach = pos(inp.tile_price_each, 0);
  const tiles_cost = totalTiles * tilePriceEach;

  // Materials (same formulas you used)
  const cementMin_bags = Math.ceil((8 * area) / 800);
  const cementMax_bags = Math.ceil((8 * area) / 600);
  const cementMin_cost = cementMin_bags * PRICE.cementBag50kg;
  const cementMax_cost = cementMax_bags * PRICE.cementBag50kg;

  const sandMin_cubes = Math.round((area / 800) * 4) / 4;
  const sandMax_cubes = Math.round((area / 600) * 4) / 4;
  const sandMin_cost = sandMin_cubes * PRICE.sandCube;
  const sandMax_cost = sandMax_cubes * PRICE.sandCube;

  const adhesiveMin_bags = Math.ceil(area / 40);
  const adhesiveMax_bags = Math.ceil(area / 30);
  const adhesiveMin_cost = adhesiveMin_bags * PRICE.adhesive25kg;
  const adhesiveMax_cost = adhesiveMax_bags * PRICE.adhesive25kg;

  const clips_qty = Math.ceil(area / 100);
  const grout_kg  = Math.ceil(area / 175);
  const clips_cost = clips_qty * PRICE.clipsPer100;
  const grout_cost = grout_kg * PRICE.groutPerKg;

  const materialsMin =
    tiles_cost + cementMin_cost + sandMin_cost + adhesiveMin_cost + clips_cost + grout_cost;
  const materialsMax =
    tiles_cost + cementMax_cost + sandMax_cost + adhesiveMax_cost + clips_cost + grout_cost;

  // Labor (override or min/max by tile)
  const userLabor = pos(inp.user_labor_rate_sqft, 0);
  const useDefaultLabor = !(userLabor > 0);

  let floorLaborMin: number, floorLaborMax: number, skirtingLaborMin: number, skirtingLaborMax: number, laborMin: number, laborMax: number;

  if (useDefaultLabor) {
    floorLaborMin = area * selected.laborMin;
    floorLaborMax = area * selected.laborMax;
    skirtingLaborMin = skirting_len_ft * selected.laborMin;
    skirtingLaborMax = skirting_len_ft * selected.laborMax;
    laborMin = floorLaborMin + skirtingLaborMin;
    laborMax = floorLaborMax + skirtingLaborMax;
  } else {
    floorLaborMin = floorLaborMax = area * userLabor;
    skirtingLaborMin = skirtingLaborMax = skirting_len_ft * userLabor;
    laborMin = laborMax = floorLaborMin + skirtingLaborMin;
  }

  const totalMin = materialsMin + laborMin;
  const totalMax = materialsMax + laborMax;

  return {
    area_sqft: area,
    skirting_len_ft,
    tile_label: selected.label,
    tile_value: selected.value,

    floor_tiles: floorTiles,
    skirting_tiles: skirtingTiles,
    wastage_tiles: wastageTiles,
    total_tiles: totalTiles,

    materialsMin, materialsMax,
    laborMin, laborMax,
    totalMin, totalMax,

    materials: {
      cementMin_bags, cementMax_bags, cementMin_cost, cementMax_cost,
      sandMin_cubes, sandMax_cubes, sandMin_cost, sandMax_cost,
      adhesiveMin_bags, adhesiveMax_bags, adhesiveMin_cost, adhesiveMax_cost,
      clips_qty, clips_cost,
      grout_kg, grout_cost,
      tiles_floor_qty: floorTiles,
      tiles_skirting_qty: skirtingTiles,
      tiles_wastage_qty: wastageTiles,   // exposed for UI
      tiles_total_qty: totalTiles,
      tiles_cost,
    },
    labor: {
      floorLaborMin, floorLaborMax, skirtingLaborMin, skirtingLaborMax, laborMin, laborMax,
    },
  };
}