import { Box, Stack, Typography, useTheme } from '@mui/material';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import type { FC } from 'react';
import type { TooltipContentProps } from 'recharts';
import { formatTick } from '@/utils/format';

function ChartTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || payload.length === 0) return null;

  const visiblePayload = payload.filter(
    (entry) => entry.dataKey !== 'quantity',
  );

  return (
    <Box
      sx={(theme) => ({
        padding: '9px 11px',
        color: theme.palette.text.primary,
        bgcolor: 'rgba(246, 240, 228, 0.96)',
        border: `2px solid ${theme.palette.text.primary}`,
        boxShadow: '3px 3px rgba(47, 53, 46, 0.18)',
      })}
    >
      <Typography
        sx={{
          mb: '4px',
          fontFamily: '"Mali", sans-serif',
          fontSize: '0.72rem',
          fontWeight: 700,
        }}
      >
        ปริมาณ {typeof label === 'number' ? formatTick(label) : label} หน่วย
      </Typography>
      {visiblePayload.map((entry) => (
        <Stack
          direction="row"
          key={String(entry.dataKey)}
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={3} direction="row" sx={{ alignItems: 'center' }}>
            <Box
              component="span"
              sx={{
                width: 14,
                borderTop: `2px solid ${entry.color ?? '#2f352e'}`,
              }}
            />
            <Typography component="span" sx={{ fontSize: '0.7rem' }}>
              {entry.name}
            </Typography>
          </Stack>
          <Typography component="strong" sx={{ fontSize: '0.72rem' }}>
            {typeof entry.value === 'number' ? formatTick(entry.value) : '—'}{' '}
            บาท
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

export const SupplyDemandChart: FC<{
  data: Array<{
    rowIndex: number;
    supply: number;
    demand: number;
    cost: number;
  }>;
  equilibrium: {
    quantity: number;
    price: number;
    exact: boolean;
  } | null;
}> = (props) => {
  const chartData = useMemo(() => {
    const interpolateCost = (
      points: Array<{ quantity: number; cost: number }>,
      quantity: number,
    ) => {
      const sortedPoints = points.toSorted(
        (left, right) => left.quantity - right.quantity,
      );
      const exactPoint = sortedPoints.find(
        (point) => Math.abs(point.quantity - quantity) < 1e-9,
      );
      if (exactPoint !== undefined) return exactPoint.cost;

      for (let index = 0; index < sortedPoints.length - 1; index += 1) {
        const current = sortedPoints[index];
        const next = sortedPoints[index + 1];
        if (current === undefined || next === undefined) continue;
        if (quantity < current.quantity || quantity > next.quantity) continue;

        const position =
          (quantity - current.quantity) / (next.quantity - current.quantity);
        return current.cost + position * (next.cost - current.cost);
      }

      return null;
    };

    const supplyPoints = props.data.map((row) => ({
      quantity: row.supply,
      cost: row.cost,
    }));
    const demandPoints = props.data.map((row) => ({
      quantity: row.demand,
      cost: row.cost,
    }));
    const quantities = new Set([
      ...supplyPoints.map((point) => point.quantity),
      ...demandPoints.map((point) => point.quantity),
    ]);
    if (props.equilibrium !== null) {
      quantities.add(props.equilibrium.quantity);
    }

    return [...quantities]
      .toSorted((left, right) => left - right)
      .map((quantity) => ({
        quantity,
        supplyCost: interpolateCost(supplyPoints, quantity),
        demandCost: interpolateCost(demandPoints, quantity),
        equilibriumCost:
          props.equilibrium !== null &&
          Math.abs(quantity - props.equilibrium.quantity) < 1e-9
            ? props.equilibrium.price
            : null,
      }));
  }, [props.data, props.equilibrium]);
  const prices = useMemo(() => {
    const dt = props.data.map((row) => row.cost);
    if (props.equilibrium !== null) {
      dt.push(props.equilibrium.price);
    }
    return dt;
  }, [props.data, props.equilibrium]);
  const quantities = useMemo(() => {
    const dt = props.data.flatMap((row) => [row.supply, row.demand]);
    if (props.equilibrium !== null) {
      dt.push(props.equilibrium.quantity);
    }
    return dt;
  }, [props.data, props.equilibrium]);

  const [
    minimumPrice,
    maximumPrice,
    minimumQuantity,
    maximumQuantity,
    priceSpan,
    quantitySpan,
  ] = useMemo(() => {
    const pMin = Math.min(...prices);
    const pMax = Math.max(...prices);
    const qMin = Math.min(...quantities);
    const qMax = Math.max(...quantities);
    return [
      pMin,
      pMax,
      qMin,
      qMax,
      pMax - pMin || Math.max(Math.abs(pMax), 1),
      qMax - qMin || Math.max(Math.abs(qMax), 1),
    ];
  }, [prices, quantities]);
  const t = useTheme();
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 390,
      }}
    >
      <Stack
        direction="row"
        spacing={4}
        sx={{
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {[
          { label: 'อุปทาน (S)', color: t.palette.primary.main },
          { label: 'อุปสงค์ (D)', color: t.palette.secondary.main },
        ].map((item) => (
          <Stack
            direction="row"
            key={item.label}
            spacing={2}
            sx={{ alignItems: 'center' }}
          >
            <Box
              component="span"
              sx={{ width: 26, borderTop: `3px solid ${item.color}` }}
            />
            <Typography component="span">{item.label}</Typography>
          </Stack>
        ))}
      </Stack>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 52, right: 28, bottom: 42, left: 18 }}>
          <CartesianGrid stroke={t.palette.divider} strokeDasharray="2 5" />
          <XAxis
            type="number"
            dataKey="quantity"
            domain={[
              minimumQuantity - quantitySpan * 0.04,
              maximumQuantity + quantitySpan * 0.04,
            ]}
            tickCount={6}
            tickFormatter={formatTick}
            stroke="#424940"
            tick={{ fill: '#454a42', fontSize: 11 }}
            label={{
              value: 'ปริมาณ (หน่วย)',
              position: 'insideBottom',
              fill: '#343a33',
              fontWeight: 700,
            }}
          />
          <YAxis
            type="number"
            domain={[
              minimumPrice - priceSpan * 0.08,
              maximumPrice + priceSpan * 0.08,
            ]}
            tickCount={6}
            tickFormatter={formatTick}
            stroke="#424940"
            tick={{ fill: '#454a42', fontSize: 11 }}
            width={54}
            label={{
              value: 'ราคา (บาท)',
              angle: -90,
              position: 'insideLeft',
              fill: '#343a33',
              fontWeight: 700,
            }}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ stroke: '#8f887b', strokeDasharray: '3 4' }}
          />

          {props.equilibrium !== null && (
            <>
              <ReferenceLine
                y={props.equilibrium.price}
                stroke="#95543f"
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
              <Scatter
                dataKey="equilibriumCost"
                name="จุดสมดุล"
                isAnimationActive={false}
                fill="#b88f4f"
                stroke="#2f352e"
                strokeWidth={2}
              />
            </>
          )}

          <Line
            type="linear"
            dataKey="supplyCost"
            connectNulls
            name="อุปทาน (S)"
            stroke={t.palette.primary.main}
            strokeWidth={3}
            dot={{ r: 4.5, fill: t.palette.background.paper, strokeWidth: 2.2 }}
            activeDot={{
              r: 6,
              fill: t.palette.background.paper,
              strokeWidth: 2.5,
            }}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="demandCost"
            connectNulls
            name="อุปสงค์ (D)"
            stroke={t.palette.secondary.main}
            strokeWidth={3}
            dot={{ r: 4.5, fill: t.palette.background.paper, strokeWidth: 2.2 }}
            activeDot={{
              r: 6,
              fill: t.palette.background.paper,
              strokeWidth: 2.5,
            }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};
