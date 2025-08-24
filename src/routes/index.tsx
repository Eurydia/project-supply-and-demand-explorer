import { HotTable } from '@handsontable/react-wrapper'
import {
  Alert,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
} from 'recharts'
import type Handsontable from 'handsontable'

export const Route = createFileRoute('/')({
  component: App,
})

type RowShape = {
  cost: number | null
  demand: number | null
  supply: number | null
}

function App() {
  const [data, setData] = useState<Array<RowShape>>(() => {
    return []
  })

  const sortedDataset = useMemo(() => {
    return data
      .filter(
        (
          a,
        ): a is {
          cost: number
          supply: number
          demand: number
        } => a.cost !== null && a.supply !== null && a.demand !== null,
      )
      .toSorted((a, b) => a.cost - b.cost)
  }, [data])
  const theme = useTheme()

  const afterChange = useCallback(
    (
      changes: Array<Handsontable.CellChange> | null,
      source: Handsontable.ChangeSource,
    ) => {
      if (!changes || source === 'loadData') {
        return
      }

      setData((prev) => {
        const next = [...prev]
        for (const [row, prop, _, newVal] of changes) {
          if (
            next[row] &&
            (next[row] as any)[prop as keyof RowShape] !== newVal
          ) {
            next[row] = { ...next[row], [prop as string]: newVal } as RowShape
          }
        }
        return next
      })
    },
    [],
  )
  useEffect(() => {
    console.debug(JSON.stringify(data))
  }, [data])

  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.primary.light,
        height: { sm: '100%', md: '100vh' },
        boxSizing: 'border-box',
      }}
    >
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid size={{ sm: 12, md: 4 }} height="100%" sx={{ overflowY: 'auto' }}>
          <Paper sx={{ overflowY: 'auto', height: '100%' }}>
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
                    TH.classList.add('row-odd')
                  } else {
                    TH.classList.remove('row-odd')
                  }
                }}
                themeName="ht-theme-main"
                width="100%"
                rowHeaders
                minSpareRows={1}
                height="auto"
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
        </Grid>
        <Grid size={{ md: 'grow' }}>
          <Paper sx={{ height: '100%', padding: 2 }}>
            <ResponsiveContainer>
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
  )
}
