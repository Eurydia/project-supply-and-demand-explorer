import { Box, Stack, Typography, useTheme } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import type { FC } from 'react';
import type { TooltipContentProps } from 'recharts';
import type { Equilibrium, Type$DatasetRowWithIndex } from '@/types/core';
import { formatTick } from '@/utils/format';

function ChartTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || payload.length === 0) return null;

  return (
    <Box
      sx={(theme) => ({
        minWidth: 150,
        p: '9px 11px',
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
        ราคา {typeof label === 'number' ? formatTick(label) : label} บาท
      </Typography>
      {payload.map((entry) => (
        <Stack
          direction="row"
          key={String(entry.dataKey)}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center', gap: '6px' }}>
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
            {typeof entry.value === 'number' ? formatTick(entry.value) : '—'}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

export const SupplyDemandChart: FC<{
  data: Array<Type$DatasetRowWithIndex>;
  equilibrium: Equilibrium | null;
}> = (props) => {
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
  }, [props.data]);

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
        aria-hidden="true"
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
            spacing={3}
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
        <LineChart
          data={props.data}
          margin={{ top: 52, right: 28, bottom: 42, left: 18 }}
        >
          <CartesianGrid stroke={t.palette.divider} strokeDasharray="2 5" />
          <XAxis
            type="number"
            dataKey="cost"
            domain={[
              minimumPrice - priceSpan * 0.04,
              maximumPrice + priceSpan * 0.04,
            ]}
            tickCount={6}
            tickFormatter={formatTick}
            stroke="#424940"
            tick={{ fill: '#454a42', fontSize: 11 }}
            label={{
              value: 'ราคา (บาท)',
              position: 'insideBottom',
              offset: -26,
              fill: '#343a33',
              fontSize: 12,
              fontWeight: 700,
            }}
          />
          <YAxis
            type="number"
            domain={[
              minimumQuantity - quantitySpan * 0.08,
              maximumQuantity + quantitySpan * 0.08,
            ]}
            tickCount={6}
            tickFormatter={formatTick}
            stroke="#424940"
            tick={{ fill: '#454a42', fontSize: 11 }}
            width={54}
            label={{
              value: 'ปริมาณ (หน่วย)',
              angle: -90,
              position: 'insideLeft',
              offset: 2,
              fill: '#343a33',
              fontSize: 12,
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
                x={props.equilibrium.price}
                stroke="#95543f"
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
              <ReferenceDot
                x={props.equilibrium.price}
                y={props.equilibrium.quantity}
                r={7}
                fill="#b88f4f"
                stroke="#2f352e"
                strokeWidth={2}
              />
            </>
          )}

          <Line
            type="linear"
            dataKey="supply"
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
            dataKey="demand"
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
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
