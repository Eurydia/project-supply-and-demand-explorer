import { Box } from '@mui/material';
import type { FocusEvent, KeyboardEvent, PropsWithChildren } from 'react';
import type { DatasetField, DatasetRow } from '@/lib/supplyDemand';

type Props = {
  data: Array<DatasetRow>;
  invalidCells: Set<string>;
  onCommit: (rowIndex: number, field: DatasetField, value: unknown) => void;
};

const COLUMNS: Array<{ key: DatasetField; label: string }> = [
  { key: 'cost', label: 'ราคา (บาท)' },
  { key: 'supply', label: 'อุปทาน (S)' },
  { key: 'demand', label: 'อุปสงค์ (D)' },
];

function HeaderCell({
  children,
  rowNumber = false,
}: PropsWithChildren<{ rowNumber?: boolean }>) {
  return (
    <Box
      component="th"
      aria-label={rowNumber ? 'หมายเลขแถว' : undefined}
      scope={rowNumber ? undefined : 'col'}
      sx={{
        position: 'sticky',
        zIndex: 2,
        top: 0,
        width: rowNumber ? 34 : undefined,
        height: 37,
        p: '4px 6px',
        color: '#fffaf0',
        bgcolor: '#4f593d',
        border: '1px solid #b5ac99',
        fontSize: '0.72rem',
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
      {children}
    </Box>
  );
}

export function DatasetTable({ data, invalidCells, onCommit }: Props) {
  const rowCount = Math.max(7, data.length + 1);

  return (
    <Box sx={{ width: '100%', height: 306, overflow: 'auto' }}>
      <Box
        component="table"
        sx={{
          width: '100%',
          minWidth: 360,
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}
      >
        <Box component="thead">
          <Box component="tr">
            <HeaderCell rowNumber />
            {COLUMNS.map((column) => (
              <HeaderCell key={column.key}>{column.label}</HeaderCell>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {Array.from({ length: rowCount }, (_, rowIndex) => {
            const row = data.at(rowIndex);
            const alternate = rowIndex % 2 === 1;
            return (
              <Box component="tr" key={rowIndex}>
                <Box
                  component="th"
                  scope="row"
                  sx={{
                    width: 34,
                    height: 37,
                    p: 0,
                    color: alternate ? '#252b25' : '#fffaf0',
                    bgcolor: alternate ? '#d9ddc9' : '#4f593d',
                    border: '1px solid #b5ac99',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  {rowIndex + 1}
                </Box>
                {COLUMNS.map((column) => {
                  const value = row?.[column.key] ?? '';
                  const invalid = invalidCells.has(`${rowIndex}:${column.key}`);
                  return (
                    <Box
                      component="td"
                      key={column.key}
                      sx={{
                        height: 37,
                        p: 0,
                        color: alternate ? '#252b25' : undefined,
                        bgcolor: invalid
                          ? '#efd3c2 !important'
                          : alternate
                            ? '#d9ddc9'
                            : '#f7f1e5',
                        border: '1px solid #b5ac99',
                        boxShadow: invalid
                          ? 'inset 0 0 0 1px #9b5944'
                          : undefined,
                      }}
                    >
                      <Box
                        component="input"
                        type="number"
                        inputMode="decimal"
                        defaultValue={value}
                        aria-label={`${column.label} แถว ${rowIndex + 1}`}
                        aria-invalid={invalid || undefined}
                        onBlur={(event: FocusEvent<HTMLInputElement>) =>
                          onCommit(rowIndex, column.key, event.target.value)
                        }
                        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                          if (event.key === 'Enter') event.currentTarget.blur();
                        }}
                        key={`${rowIndex}-${column.key}-${String(value)}`}
                        sx={(theme) => ({
                          boxSizing: 'border-box',
                          width: '100%',
                          height: '100%',
                          p: '4px 9px',
                          color: '#252b25',
                          bgcolor: 'transparent',
                          border: 0,
                          borderRadius: 0,
                          font: 'inherit',
                          fontSize: '0.78rem',
                          textAlign: 'right',
                          '&:focus': {
                            position: 'relative',
                            zIndex: 1,
                            outline: `3px solid ${theme.palette.secondary.main}`,
                            outlineOffset: '-3px',
                            bgcolor: '#ead7a9',
                          },
                          '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button':
                            {
                              m: 0,
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              appearance: 'none',
                            },
                        })}
                      />
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
