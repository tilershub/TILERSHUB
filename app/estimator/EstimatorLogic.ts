// EstimatorLogic.ts

export type Inputs = {
  // Either provide area directly OR len_ft & wid_ft (area will be computed if not given)
  area_sqft?: number;
  len_ft?: number;
  wid_ft?: number;

  tile_value: string;          // e.g., "600x600" (matches tile-sizes.json `value`)
  tile_price_each: number;     // LKR per tile (your estimator.js uses per tile price)
  skirting_len_ft?: number;    // if empty -> defaults to ceil(20% of area)
  user_labor_rate_sqft?: number; // overrides min/max if > 0
};

export type TileSize = {
  label: string;
  value: string;          // unique key ("600x600")
  width: number;          // inches (for display only)
  height: number;         // inches (for display only)
  sqft: number;           // sqft per tile
  laborMin: number;       // LKR / sqft
  laborMax: number;       // LKR / sqft
  skirtingCoverage: number; // linear feet covered by one tile laid as skirting
};

export type MaterialBreakdown = {
  cementMin_bags: number;
  cementMax_bags: number;
  cementMin_cost: number;
  cementMax_cost: number;

  sandMin_cubes: number;
  sandMax_cubes: number;
  sandMin_cost: number;
  sandMax_cost: number;

  adhesiveMin_bags: number;
  adhesiveMax_bags: number;
  adhesiveMin_cost: number;
  adhesiveMax_cost: number;

  clips_qty: number;
  clips_cost: number;

  grout_kg: number;
  grout_cost: number;

  tiles_total_qty: number;
  tiles_cost: number;
};

export type LaborBreakdown = {
  floorLaborMin: number;
  floorLaborMax: number;
  skirtingLaborMin: number;
  skirtingLaborMax: number;
  laborMin: number;
  laborMax: number;
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
  total_tiles: number; // includes 5% wastage

  // Costs
  materialsMin: number;
  materialsMax: number;
  laborMin: number;
  laborMax: number;
  totalMin: number;
  totalMax: number;

  // Detailed breakdowns
  materials: MaterialBreakdown;
  labor: LaborBreakdown;
};

// =======================
// Tunable price constants
// =======================
const PRICE = {
  cementBag50kg: 1900, // LKR
  sandCube: 25000,
  adhesive25kg: 2200,
  clipsPer100: 1500,
  groutPerKg: 300,
};

// Safe helpers
const safe = (n: unknown, fb = 0) => (Number.isFinite(Number(n)) ? Number(n) : fb);
const pos = (n: unknown, fb = 0) => {
  const v = safe(n, fb);
  return v > 0 ? v : fb;
};

export function computeReport(inp: Inputs, sizes: { tileSizes: TileSize[] }): Report {
  // Find selected tile settings
  const all = sizes?.tileSizes ?? [];
  const selected = all.find((t) => t.value === inp.tile_value) ?? all[0];
  if (!selected) {
    throw new Error("No tile sizes available.");
  }

  // Area (sqft)
  const area_from_len_wid =
    pos(inp.len_ft, 0) > 0 && pos(inp.wid_ft, 0) > 0 ? pos(inp.len_ft) * pos(inp.wid_ft) : 0;
  const area = +(pos(inp.area_sqft, area_from_len_wid)).toFixed(2);

  if (area <= 0) {
    throw new Error("Area must be > 0 (provide area or length × width).");
  }

  // Skirting default (20% of area) if not provided
  const userSkirting = pos(inp.skirting_len_ft, NaN);
  const skirting_len_ft =
    Number.isFinite(userSkirting) && userSkirting > 0 ? Math.ceil(userSkirting) : Math.ceil(area * 0.2);

  // Tiles
  const perTileSqft = pos(selected.sqft, 0);
  const floorTiles = perTileSqft > 0 ? Math.ceil(area / perTileSqft) : 0;

  const skirtingCoverage = Math.max(1, pos(selected.skirtingCoverage, 1)); // avoid /0
  const skirtingTiles = Math.ceil(skirting_len_ft / skirtingCoverage);

  // 5% wastage (your file)
  const totalTiles = Math.ceil((floorTiles + skirtingTiles) * 1.05);

  // Tile price: your estimator.js uses "tilePrice" as price per tile
  const tilePriceEach = pos(inp.tile_price_each, 0);
  const tiles_cost = totalTiles * tilePriceEach;

  // Floor bed & tiling materials (same formulas you used)
  const cementMin_bags = Math.ceil((8 * area) / 800);
  const cementMax_bags = Math.ceil((8 * area) / 600);
  const cementMin_cost = cementMin_bags * PRICE.cementBag50kg;
  const cementMax_cost = cementMax_bags * PRICE.cementBag50kg;

  const sandMin_cubes = Math.round((area / 800) * 4) / 4; // to nearest 0.25
  const sandMax_cubes = Math.round((area / 600) * 4) / 4;
  const sandMin_cost = sandMin_cubes * PRICE.sandCube;
  const sandMax_cost = sandMax_cubes * PRICE.sandCube;

  const adhesiveMin_bags = Math.ceil(area / 40);
  const adhesiveMax_bags = Math.ceil(area / 30);
  const adhesiveMin_cost = adhesiveMin_bags * PRICE.adhesive25kg;
  const adhesiveMax_cost = adhesiveMax_bags * PRICE.adhesive25kg;

  const clips_qty = Math.ceil(area / 100); // packs of 100 pcs
  const grout_kg = Math.ceil(area / 175);
  const clips_cost = clips_qty * PRICE.clipsPer100;
  const grout_cost = grout_kg * PRICE.groutPerKg;

  const materialsMin =
    tiles_cost +
    cementMin_cost +
    sandMin_cost +
    adhesiveMin_cost +
    clips_cost +
    grout_cost;

  const materialsMax =
    tiles_cost +
    cementMax_cost +
    sandMax_cost +
    adhesiveMax_cost +
    clips_cost +
    grout_cost;

  // Labor
  const userLabor = pos(inp.user_labor_rate_sqft, 0);
  const useDefaultLabor = !(userLabor > 0);

  const laborMinRate = selected.laborMin;
  const laborMaxRate = selected.laborMax;

  let floorLaborMin: number, floorLaborMax: number, skirtingLaborMin: number, skirtingLaborMax: number, laborMin: number, laborMax: number;

  if (useDefaultLabor) {
    floorLaborMin = area * laborMinRate;
    floorLaborMax = area * laborMaxRate;
    skirtingLaborMin = skirting_len_ft * laborMinRate;
    skirtingLaborMax = skirting_len_ft * laborMaxRate;
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
    total_tiles: totalTiles,

    materialsMin,
    materialsMax,
    laborMin,
    laborMax,
    totalMin,
    totalMax,

    materials: {
      cementMin_bags,
      cementMax_bags,
      cementMin_cost,
      cementMax_cost,
      sandMin_cubes,
      sandMax_cubes,
      sandMin_cost,
      sandMax_cost,
      adhesiveMin_bags,
      adhesiveMax_bags,
      adhesiveMin_cost,
      adhesiveMax_cost,
      clips_qty,
      clips_cost,
      grout_kg,
      grout_cost,
      tiles_total_qty: totalTiles,
      tiles_cost,
    },
    labor: {
      floorLaborMin,
      floorLaborMax,
      skirtingLaborMin,
      skirtingLaborMax,
      laborMin,
      laborMax,
    },
  };
}