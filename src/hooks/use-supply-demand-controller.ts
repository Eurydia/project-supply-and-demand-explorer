import { useCallback, useMemo } from 'react';
import {
  getCompleteDataset,
  getEquilibrium,
  validateDataset,
} from '@/lib/supply-demand';
import type { Type$DatasetRow } from '@/types/core';

export const useSupplyDemandExplorer = (options: {
  data: Array<Type$DatasetRow>;
  onChange: (value: Array<Type$DatasetRow>) => unknown;
}) => {
  const sortedDataset = useMemo(
    () => getCompleteDataset(options.data),
    [options.data],
  );
  const equilibrium = useMemo(
    () => getEquilibrium(sortedDataset),
    [sortedDataset],
  );
  const validation = useMemo(
    () => validateDataset(options.data),
    [options.data],
  );

  const handleLoadSampleData = useCallback(
    () =>
      options.onChange([
        { cost: 10, supply: 12, demand: 52 },
        { cost: 20, supply: 22, demand: 43 },
        { cost: 30, supply: 32, demand: 33 },
        { cost: 40, supply: 43, demand: 24 },
        { cost: 50, supply: 54, demand: 14 },
      ]),
    [options.onChange],
  );

  const handleClearData = useCallback(
    () => options.onChange([]),
    [options.onChange],
  );

  return {
    sortedDataset,
    equilibrium,
    validation,
    errors: {
      cells: validation.invalidCells,
      messages: validation.messages,
    },
    handleLoadSampleData,
    handleClearData,
  };
};

export type SupplyDemandExplorerController = ReturnType<
  typeof useSupplyDemandExplorer
>;
