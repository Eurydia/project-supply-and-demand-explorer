import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SetStateAction } from 'react';
import {
  DATASET_STORAGE_KEY,
  EMPTY_ROW,
  HISTORY_LIMIT,
  SAMPLE_DATA,
  getCompleteDataset,
  getEquilibrium,
  parseStoredDataset,
  toNumericValue,
  validateDataset,
} from '@/lib/supplyDemand';
import type { DatasetField, DatasetRow } from '@/lib/supplyDemand';

type DatasetHistory = {
  future: Array<Array<DatasetRow>>;
  past: Array<Array<DatasetRow>>;
  present: Array<DatasetRow>;
};

function loadSavedDataset() {
  if (typeof window === 'undefined') return [];
  try {
    return parseStoredDataset(window.localStorage.getItem(DATASET_STORAGE_KEY));
  } catch {
    return [];
  }
}

function useDatasetHistory() {
  const [history, setHistory] = useState<DatasetHistory>(() => ({
    future: [],
    past: [],
    present: loadSavedDataset(),
  }));

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DATASET_STORAGE_KEY,
        JSON.stringify(history.present),
      );
    } catch {
      // The explorer remains usable when storage is unavailable or full.
    }
  }, [history.present]);

  const setData = useCallback(
    (nextValue: SetStateAction<Array<DatasetRow>>) => {
      setHistory((current) => {
        const next =
          typeof nextValue === 'function'
            ? nextValue(current.present)
            : nextValue;
        if (JSON.stringify(next) === JSON.stringify(current.present)) {
          return current;
        }

        return {
          past: [...current.past, current.present].slice(-HISTORY_LIMIT),
          present: next,
          future: [],
        };
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future].slice(0, HISTORY_LIMIT),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current;
      const [next, ...future] = current.future;
      if (!next) return current;
      return {
        past: [...current.past, current.present].slice(-HISTORY_LIMIT),
        present: next,
        future,
      };
    });
  }, []);

  return {
    data: history.present,
    setData,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}

export function useSupplyDemandExplorer() {
  const { data, setData, undo, redo, canUndo, canRedo } = useDatasetHistory();

  const sortedDataset = useMemo(() => getCompleteDataset(data), [data]);
  const equilibrium = useMemo(
    () => getEquilibrium(sortedDataset),
    [sortedDataset],
  );
  const validation = useMemo(() => validateDataset(data), [data]);

  const handleTableCommit = useCallback(
    (rowIndex: number, field: DatasetField, value: unknown) => {
      setData((previousRows) => {
        const nextRows = previousRows.map((row) => ({ ...row }));
        while (nextRows.length <= rowIndex) nextRows.push({ ...EMPTY_ROW });
        nextRows[rowIndex] = {
          ...nextRows[rowIndex],
          [field]: toNumericValue(value),
        };
        return nextRows;
      });
    },
    [setData],
  );

  const loadSampleData = useCallback(
    () => setData(SAMPLE_DATA.map((row) => ({ ...row }))),
    [setData],
  );
  const clearData = useCallback(() => setData([]), [setData]);

  return {
    data,
    sortedDataset,
    equilibrium,
    validation,
    handleTableCommit,
    loadSampleData,
    clearData,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

export type SupplyDemandExplorerController = ReturnType<
  typeof useSupplyDemandExplorer
>;
