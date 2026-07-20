import { z } from 'zod/v4';
import { useCallback, useEffect, useState } from 'react';
import { DATASET_STORAGE_KEY } from '@/lib/supply-demand';

export const useDatasetHistory = () => {
  const [history, setHistory] = useState(() => {
    let present: Array<{
      demand: number | null;
      supply: number | null;
      cost: number | null;
    }> = [];
    try {
      present = z
        .object({
          demand: z.number().nullable(),
          supply: z.number().nullable(),
          cost: z.number().nullable(),
        })
        .array()
        .catch([])
        .parse(JSON.parse(localStorage.getItem(DATASET_STORAGE_KEY) ?? '[]'));
    } catch {
      present = [];
    }

    return {
      future: [] as Array<
        Array<{
          demand: number | null;
          supply: number | null;
          cost: number | null;
        }>
      >,
      past: [] as Array<
        Array<{
          demand: number | null;
          supply: number | null;
          cost: number | null;
        }>
      >,
      present,
    };
  });

  useEffect(() => {
    window.localStorage.setItem(
      DATASET_STORAGE_KEY,
      JSON.stringify(history.present),
    );
  }, [history.present]);

  const update = useCallback(
    (
      value: Array<{
        demand: number | null;
        supply: number | null;
        cost: number | null;
      }>,
    ) => {
      setHistory((state) => {
        if (JSON.stringify(value) === JSON.stringify(state.present))
          return state;
        return {
          past: [...state.past, state.present],
          present: value,
          future: [],
        };
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setHistory((state) => {
      const lastState = state.past.at(-1);
      if (lastState === undefined) return state;
      return {
        past: state.past.slice(0, -1),
        present: lastState,
        future: [state.present, ...state.future],
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
        past: [...state.past, state.present],
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
