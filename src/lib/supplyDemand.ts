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
    .filter(
      (row): row is CompleteDatasetRow =>
        row.cost !== null && row.supply !== null && row.demand !== null,
    )
    .toSorted((a, b) => a.cost - b.cost);
}

export function getClosestBalance(data: Array<CompleteDatasetRow>) {
  if (!data.length) return null;
  return data.reduce((closest, row) =>
    Math.abs(row.supply - row.demand) <
    Math.abs(closest.supply - closest.demand)
      ? row
      : closest,
  );
}
