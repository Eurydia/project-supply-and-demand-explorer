import { useCallback, useEffect, useState } from 'react';
import type { Type$DatasetRow } from '@/types/core';
import { DATASET_STORAGE_KEY } from '@/lib/supply-demand';
import { Schema$DatasetRow } from '@/types/core';

const HISTORY_LIMIT = 50;

function loadStoredDataset(): Array<Type$DatasetRow> {
  try {
    const stored = window.localStorage.getItem(DATASET_STORAGE_KEY);
    if (!stored) return [];
    return Schema$DatasetRow.array().catch([]).parse(JSON.parse(stored));
  } catch {
    return [];
  }
}

export const useDatasetHistory = () => {
  const [history, setHistory] = useState(() => ({
    future: [] as Array<Array<Type$DatasetRow>>,
    past: [] as Array<Array<Type$DatasetRow>>,
    present: loadStoredDataset(),
  }));

  useEffect(() => {
    window.localStorage.setItem(
      DATASET_STORAGE_KEY,
      JSON.stringify(history.present),
    );
  }, [history.present]);

  const update = useCallback((value: Array<Type$DatasetRow>) => {
    setHistory((state) => {
      if (JSON.stringify(value) === JSON.stringify(state.present)) return state;
      return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: value,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((state) => {
      const lastState = state.past.at(-1);
      if (lastState === undefined) return state;
      return {
        past: state.past.slice(0, -1),
        present: lastState,
        future: [state.present, ...state.future].slice(0, HISTORY_LIMIT),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((state) => {
      const [next, ...future] = state.future;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!next) {
        return state;
      }
      return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: next,
        future,
      };
    });
  }, []);

  return {
    update,
    undo,
    redo,
    data: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};
