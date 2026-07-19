import { z } from 'zod/v4';

export const Schema$DatasetRow = z.strictObject({
  cost: z.number().nullable(),
  demand: z.number().nullable(),
  supply: z.number().nullable(),
});

export type Type$DatasetRow = z.infer<typeof Schema$DatasetRow>;

export const Schema$DatasetRowWithIndex = Schema$DatasetRow.extend(
  z.strictObject({
    rowIndex: z.number(),
  }).shape,
);

export type Type$DatasetRowWithIndex = {
  cost: number;
  demand: number;
  supply: number;
  rowIndex: number;
};

export type Equilibrium = {
  exact: boolean;
  price: number;
  quantity: number;
};

export type DatasetValidation = {
  invalidCells: Set<{
    row: number;
    column: 'cost' | 'demand' | 'supply';
  }>;
  messages: Array<string>;
};
