import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { getTheme, mainTheme, registerTheme } from 'handsontable/themes';
import { useMemo } from 'react';
import type { FC } from 'react';
import type { CellChange, ChangeSource } from 'handsontable';
import type { Type$DatasetRow } from '@/types/core';

registerAllModules();

const tableTheme =
  getTheme('supply-demand-earth') ??
  registerTheme('supply-demand-earth', mainTheme)
    .setColorScheme('light')
    .setDensityType('compact')
    .params({
      tokens: {
        fontFamily: '"Noto Sans Thai", system-ui, sans-serif',
        fontSize: '13px',
        borderRadius: '0px',
        borderColor: '#b5ac99',
        accentColor: '#95543f',
        foregroundColor: '#252b25',
        foregroundSecondaryColor: '#5f6257',
        backgroundColor: '#f7f1e5',
        backgroundSecondaryColor: '#d9ddc9',
        cellHorizontalBorderColor: '#b5ac99',
        cellVerticalBorderColor: '#b5ac99',
        rowCellOddBackgroundColor: '#f7f1e5',
        rowCellEvenBackgroundColor: '#d9ddc9',
        rowHeaderOddBackgroundColor: '#f7f1e5',
        rowHeaderEvenBackgroundColor: '#d9ddc9',
        headerFontWeight: '700',
        headerForegroundColor: '#fffaf0',
        headerBackgroundColor: '#4f593d',
        headerHighlightedForegroundColor: '#fffaf0',
        headerHighlightedBackgroundColor: '#5b6641',
        headerActiveForegroundColor: '#fffaf0',
        headerActiveBackgroundColor: '#3f482e',
        cellEditorBorderColor: '#95543f',
        cellEditorBackgroundColor: '#ead7a9',
        cellSelectionBorderColor: '#95543f',
        cellSelectionBackgroundColor: '#ead7a9',
        cellErrorBackgroundColor: '#efd3c2',
        scrollbarTrackColor: '#e9dfce',
        scrollbarThumbColor: '#8d927d',
      },
    });

type Props = {
  data: Array<Type$DatasetRow>;
  invalidCells: Set<{ row: number; column: 'cost' | 'supply' | 'demand' }>;
  onChange: (data: Array<Type$DatasetRow>) => void;
};

export const DatasetTable: FC<Props> = (props) => {
  const tableData = useMemo(
    () => props.data.map((row) => ({ ...row })),
    [props.data],
  );
  const invalidKeys = useMemo(
    () =>
      new Set(
        [...props.invalidCells].map((cell) => `${cell.row}:${cell.column}`),
      ),
    [props.invalidCells],
  );

  return (
    <HotTable
      data={tableData}
      columns={[
        { data: 'cost', type: 'numeric', numericFormat: { pattern: '0,0.##' } },
        {
          data: 'supply',
          type: 'numeric',
          numericFormat: { pattern: '0,0.##' },
        },
        {
          data: 'demand',
          type: 'numeric',
          numericFormat: { pattern: '0,0.##' },
        },
      ]}
      colHeaders={['ราคา (บาท)', 'อุปทาน (S)', 'อุปสงค์ (D)']}
      rowHeaders
      minRows={7}
      minSpareRows={1}
      width="100%"
      height={306}
      stretchH="all"
      autoWrapRow
      autoWrapCol
      navigableHeaders
      tabNavigation
      allowInvalid
      cells={(row: number, column: number) => {
        const field = (['cost', 'supply', 'demand'] as const).at(column);
        return {
          valid: field ? !invalidKeys.has(`${row}:${field}`) : true,
        };
      }}
      afterChange={(
        changes: Array<CellChange> | null,
        source: ChangeSource,
      ) => {
        if (!changes || source === 'loadData') {
          return;
        }

        const next = props.data.map((row) => ({ ...row }));
        changes.forEach(([rowIndex, property, , value]) => {
          while (next.length <= rowIndex) {
            next.push({ cost: null, demand: null, supply: null });
          }
          const field = String(property) as 'cost' | 'supply' | 'demand';
          next[rowIndex] = {
            ...next[rowIndex],
            [field]: value,
          };
        });

        while (
          next.length > 0 &&
          Object.values(next.at(-1) ?? {}).every((value) => value === null)
        ) {
          next.pop();
        }
        props.onChange(next);
      }}
      theme={tableTheme}
      injectCoreCss
      licenseKey="non-commercial-and-evaluation"
    />
  );
};
