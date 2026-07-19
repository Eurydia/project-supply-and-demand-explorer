export type DatasetRow = {
  cost: number | null;
  demand: number | null;
  supply: number | null;
};

export type CompleteDatasetRow = {
  cost: number;
  demand: number;
  supply: number;
};

export type CompleteDatasetRowWithIndex = CompleteDatasetRow & {
  rowIndex: number;
};

export type Equilibrium = {
  exact: boolean;
  price: number;
  quantity: number;
};

export type DatasetValidation = {
  invalidCells: Set<string>;
  messages: Array<string>;
};

export const DATASET_STORAGE_KEY = 'supply-demand-explorer.dataset.v1';
export const HISTORY_LIMIT = 50;
export const DATASET_FIELDS = ['cost', 'supply', 'demand'] as const;
export type DatasetField = (typeof DATASET_FIELDS)[number];

export const SAMPLE_DATA: Array<DatasetRow> = [
  { cost: 10, supply: 12, demand: 52 },
  { cost: 20, supply: 22, demand: 43 },
  { cost: 30, supply: 32, demand: 33 },
  { cost: 40, supply: 43, demand: 24 },
  { cost: 50, supply: 54, demand: 14 },
];

export const EMPTY_ROW: DatasetRow = {
  cost: null,
  demand: null,
  supply: null,
};

export function toNumericValue(value: unknown) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getCompleteDataset(data: Array<DatasetRow>) {
  return data
    .map((row, rowIndex) => ({ ...row, rowIndex }))
    .filter((row): row is CompleteDatasetRowWithIndex =>
      DATASET_FIELDS.every((field) => row[field] !== null),
    )
    .toSorted((a, b) => a.cost - b.cost);
}

export function getEquilibrium(
  data: Array<CompleteDatasetRow>,
): Equilibrium | null {
  const exactRow = data.find((row) => Math.abs(row.supply - row.demand) < 1e-9);

  if (exactRow) {
    return {
      exact: true,
      price: exactRow.cost,
      quantity: exactRow.supply,
    };
  }

  for (let index = 0; index < data.length - 1; index += 1) {
    const current = data[index];
    const next = data[index + 1];
    if (!current || !next) continue;

    const currentDifference = current.supply - current.demand;
    const nextDifference = next.supply - next.demand;
    if (currentDifference * nextDifference >= 0) continue;

    const interpolation =
      currentDifference / (currentDifference - nextDifference);
    const price = current.cost + interpolation * (next.cost - current.cost);
    const supply =
      current.supply + interpolation * (next.supply - current.supply);
    const demand =
      current.demand + interpolation * (next.demand - current.demand);

    return {
      exact: false,
      price,
      quantity: (supply + demand) / 2,
    };
  }

  return null;
}

function hasStartedRow(row: DatasetRow) {
  return DATASET_FIELDS.some((field) => row[field] !== null);
}

export function validateDataset(data: Array<DatasetRow>): DatasetValidation {
  const invalidCells = new Set<string>();
  const messages: Array<string> = [];
  let incompleteRows = 0;
  let negativeCells = 0;

  data.forEach((row, rowIndex) => {
    if (!hasStartedRow(row)) return;

    const missingFields = DATASET_FIELDS.filter((field) => row[field] === null);
    if (missingFields.length > 0) {
      incompleteRows += 1;
      missingFields.forEach((field) =>
        invalidCells.add(`${rowIndex}:${field}`),
      );
    }

    DATASET_FIELDS.forEach((field) => {
      const value = row[field];
      if (value !== null && value < 0) {
        negativeCells += 1;
        invalidCells.add(`${rowIndex}:${field}`);
      }
    });
  });

  if (incompleteRows > 0) {
    messages.push(`ข้อมูลไม่ครบ ${incompleteRows.toLocaleString('th-TH')} แถว`);
  }
  if (negativeCells > 0) {
    messages.push(`พบค่าติดลบ ${negativeCells.toLocaleString('th-TH')} ช่อง`);
  }

  const completeDataset = getCompleteDataset(data);
  const priceRows = new Map<number, Array<number>>();
  completeDataset.forEach((row) => {
    const rows = priceRows.get(row.cost) ?? [];
    rows.push(row.rowIndex);
    priceRows.set(row.cost, rows);
  });

  const duplicatePriceGroups = [...priceRows.values()].filter(
    (rows) => rows.length > 1,
  );
  duplicatePriceGroups.forEach((rows) =>
    rows.forEach((rowIndex) => invalidCells.add(`${rowIndex}:cost`)),
  );
  if (duplicatePriceGroups.length > 0) {
    messages.push(
      `พบราคาซ้ำ ${duplicatePriceGroups.length.toLocaleString('th-TH')} ค่า`,
    );
  }

  let supplyReversals = 0;
  let demandReversals = 0;
  for (let index = 1; index < completeDataset.length; index += 1) {
    const previous = completeDataset[index - 1];
    const current = completeDataset[index];
    if (!previous || !current || current.cost === previous.cost) continue;

    if (current.supply < previous.supply) supplyReversals += 1;
    if (current.demand > previous.demand) demandReversals += 1;
  }

  if (supplyReversals > 0) {
    messages.push(
      `อุปทานลดลงเมื่อราคาเพิ่มขึ้น ${supplyReversals.toLocaleString('th-TH')} ช่วง`,
    );
  }
  if (demandReversals > 0) {
    messages.push(
      `อุปสงค์เพิ่มขึ้นเมื่อราคาเพิ่มขึ้น ${demandReversals.toLocaleString('th-TH')} ช่วง`,
    );
  }

  return { invalidCells, messages };
}

function isStoredValue(value: unknown): value is number | null {
  return (
    value === null || (typeof value === 'number' && Number.isFinite(value))
  );
}

export function parseStoredDataset(value: string | null): Array<DatasetRow> {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (row): row is DatasetRow =>
          typeof row === 'object' &&
          row !== null &&
          isStoredValue((row as DatasetRow).cost) &&
          isStoredValue((row as DatasetRow).supply) &&
          isStoredValue((row as DatasetRow).demand),
      )
    ) {
      return parsed;
    }
  } catch {
    // Invalid or outdated saved data is discarded so the app can still load.
  }

  return [];
}
