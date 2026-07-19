export const DATASET_STORAGE_KEY = 'supply-demand-explorer.dataset.v1';
export const DATASET_FIELDS = ['cost', 'supply', 'demand'] as const;
export type DatasetField = (typeof DATASET_FIELDS)[number];

export function getCompleteDataset(
  data: Array<{
    cost: number | null;
    supply: number | null;
    demand: number | null;
  }>,
) {
  return data
    .map((row, rowIndex) => ({ ...row, rowIndex }))
    .filter(
      (
        row,
      ): row is {
        cost: number;
        supply: number;
        demand: number;
        rowIndex: number;
      } => row.cost !== null && row.demand !== null && row.supply !== null,
    )
    .toSorted((a, b) => a.cost - b.cost);
}

export const getEquilibrium = (
  data: Array<{ cost: number; supply: number; demand: number }>,
) => {
  const exactRow = data.find((row) => Math.abs(row.supply - row.demand) < 1e-9);
  if (exactRow) {
    return {
      exact: true,
      price: exactRow.cost,
      quantity: exactRow.supply,
    };
  }

  for (let index = 0; index < data.length - 1; index += 1) {
    const current = data.at(index);
    const next = data.at(index + 1);
    if (!current || !next) {
      continue;
    }

    const currentDifference = current.supply - current.demand;
    const nextDifference = next.supply - next.demand;
    if (currentDifference * nextDifference >= 0) {
      continue;
    }

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
};

export const validateDataset = (
  data: Array<{
    cost: number | null;
    supply: number | null;
    demand: number | null;
  }>,
) => {
  const invalidCells = new Set<{
    row: number;
    column: 'cost' | 'supply' | 'demand';
  }>();
  const messages: Array<string> = [];
  let incompleteRows = 0;
  let invalidRows = 0;
  console.debug(data);

  data.forEach((row, rowIndex) => {
    if (row.cost === null && row.demand === null && row.supply === null) {
      return;
    }

    const missingCells = DATASET_FIELDS.filter((field) => row[field] === null);
    if (missingCells.length > 0) {
      incompleteRows += 1;
      missingCells.forEach((field) =>
        invalidCells.add({ row: rowIndex, column: field }),
      );
    }

    const nanCells = DATASET_FIELDS.filter(
      (field) => row[field] !== null && Number.isNaN(Number(row[field])),
    );
    if (nanCells.length > 0) {
      invalidRows += 1;
      nanCells.forEach((field) =>
        invalidCells.add({ row: rowIndex, column: field }),
      );
    }
  });

  if (incompleteRows > 0) {
    messages.push(`ข้อมูลไม่ครบ ${incompleteRows.toLocaleString('th-TH')} แถว`);
  }
  if (invalidRows > 0) {
    messages.push(
      `ข้อมูลถูกต้อง ${incompleteRows.toLocaleString('th-TH')} แถว`,
    );
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
    rows.forEach((rowIndex) =>
      invalidCells.add({ row: rowIndex, column: 'cost' }),
    ),
  );
  if (duplicatePriceGroups.length > 0) {
    messages.push(
      `พบราคาซ้ำ ${duplicatePriceGroups.length.toLocaleString('th-TH')} ค่า`,
    );
  }

  return { invalidCells, messages };
};
