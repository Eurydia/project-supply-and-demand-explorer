import { useCallback, useMemo, useState } from 'react';
import type Handsontable from 'handsontable';
import {
  EMPTY_ROW,
  SAMPLE_DATA,
  getClosestBalance,
  getCompleteDataset,
  toNumericValue,
} from '@/lib/supplyDemand';
import type { DatasetRow } from '@/lib/supplyDemand';

export function useSupplyDemandExplorer() {
  const [data, setData] = useState<Array<DatasetRow>>([]);

  const sortedDataset = useMemo(() => getCompleteDataset(data), [data]);
  const closestBalance = useMemo(
    () => getClosestBalance(sortedDataset),
    [sortedDataset],
  );

  const handleTableChange = useCallback(
    (
      changes: Array<Handsontable.CellChange> | null,
      source: Handsontable.ChangeSource,
    ) => {
      if (!changes || source === 'loadData') return;

      setData((previousRows) => {
        const nextRows = previousRows.map((row) => ({ ...row }));
        for (const [rowIndex, property, , newValue] of changes) {
          while (nextRows.length <= rowIndex) nextRows.push({ ...EMPTY_ROW });
          const key = property as keyof DatasetRow;
          nextRows[rowIndex] = {
            ...nextRows[rowIndex],
            [key]: toNumericValue(newValue),
          };
        }
        return nextRows;
      });
    },
    [],
  );

  const loadSampleData = useCallback(
    () => setData(SAMPLE_DATA.map((row) => ({ ...row }))),
    [],
  );
  const clearData = useCallback(() => setData([]), []);

  return {
    data,
    sortedDataset,
    closestBalance,
    handleTableChange,
    loadSampleData,
    clearData,
  };
}

export type SupplyDemandExplorerController = ReturnType<
  typeof useSupplyDemandExplorer
>;
