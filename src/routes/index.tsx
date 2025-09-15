import { HotTable } from '@handsontable/react-wrapper';
import { Alert, Box, Grid, Paper, Stack } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type Handsontable from 'handsontable';

export const Route = createFileRoute('/')({
  component: App,
});

type RowShape = {
  cost: number | null;
  demand: number | null;
  supply: number | null;
};

function App() {
  const [data, setData] = useState<Array<RowShape>>(() => {
    return [];
  });

  const sortedDataset = useMemo(() => {
    return data
      .filter(
        (
          a,
        ): a is {
          cost: number;
          supply: number;
          demand: number;
        } => a.cost !== null && a.supply !== null && a.demand !== null,
      )
      .toSorted((a, b) => a.cost - b.cost);
  }, [data]);

  const afterChange = useCallback(
    (
      changes: Array<Handsontable.CellChange> | null,
      source: Handsontable.ChangeSource,
    ) => {
      if (!changes || source === 'loadData') {
        return;
      }

      setData((prev) => {
        const next = [...prev];
        for (const [row, prop, _, newVal] of changes) {
          if (
            next[row] &&
            (next[row] as any)[prop as keyof RowShape] !== newVal
          ) {
            next[row] = { ...next[row], [prop as string]: newVal } as RowShape;
          }
        }
        return next;
      });
    },
    [],
  );

  return (
    <Box
      padding={2}
      sx={{
        boxSizing: 'border-box',
        height: '100%',
      }}
    >
      <Grid container spacing={2} height={'100%'}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Paper
              sx={{
                flexBasis: 0,
                flexGrow: 1,
              }}
            >
              <Stack spacing={2}>
                <Alert severity="info">
                  ป้อนข้อมูลตัวเลขลงในตารางด้านล่าง
                  จะแสดงผลตามข้อมูลที่ใส่โดยอัตโนมัต
                </Alert>
                <HotTable
                  data={data}
                  dataSchema={{ cost: null, demand: null, supply: null }}
                  columns={[
                    { data: 'cost', type: 'numeric' },
                    { data: 'supply', type: 'numeric' },
                    { data: 'demand', type: 'numeric' },
                  ]}
                  colHeaders={[
                    'ราคา (บาท/หน่วย)',
                    'ปริมาณความต่อการขาย (s)',
                    'ปริมาณความต่อการซื้อ (d)',
                  ]}
                  cells={(row) => ({
                    className: row % 2 === 1 ? ['row-odd'] : [],
                  })}
                  afterGetRowHeader={(row, TH) => {
                    if (row % 2 === 1) {
                      TH.classList.add('row-odd');
                    } else {
                      TH.classList.remove('row-odd');
                    }
                  }}
                  themeName="ht-theme-main"
                  width="100%"
                  rowHeaders
                  minSpareRows={1}
                  height={`max(200px, 30vh)`}
                  licenseKey="non-commercial-and-evaluation"
                  columnSorting={false}
                  multiColumnSorting={false}
                  manualColumnMove={false}
                  manualRowMove={false}
                  mergeCells={false}
                  afterChange={afterChange}
                />
              </Stack>
            </Paper>
            <Alert severity="success">พื้นที่สำหรับเพิ่มชื่อคุณครู</Alert>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 'grow' }}>
          <Paper sx={{ height: { xs: '75vh', md: '100%' }, padding: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedDataset}>
                <CartesianGrid strokeDasharray="3 3" />
                <Legend verticalAlign="top" align="right" />
                <XAxis
                  dataKey="cost"
                  type="number"
                  tickMargin={8}
                  domain={['dataMin', 'dataMax']}
                >
                  <Label value={'ราคา'} position={'centerBottom'} />
                </XAxis>
                <YAxis
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickMargin={8}
                  label={{
                    value: 'ปริมาณความต่อการขาย-ซื้อ',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip isAnimationActive={false} />
                <Line
                  type="linear"
                  name="ปริมาณความต่อการขาย (s)"
                  dataKey="supply"
                  dot={false}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <Line
                  type="linear"
                  dataKey="demand"
                  name="ปริมาณความต่อการซื้อ (d)"
                  dot={false}
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
