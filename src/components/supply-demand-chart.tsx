import { Box, Stack, Typography, useTheme } from "@mui/material";
import { type FC, Fragment, useMemo } from "react";
import type { TooltipContentProps } from "recharts";
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
} from "recharts";
import { formatTick } from "@/utils/format";

function ChartTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || payload.length === 0) return null;

  const visiblePayload = payload.filter(
    (entry) => entry.dataKey !== "quantity",
  );

  return (
    <Box
      component="dl"
      sx={(theme) => ({
        margin: 0,
        padding: theme.spacing(1.125, 1.375),
        color: theme.palette.text.primary,
        bgcolor: theme.alpha(theme.palette.background.paper, 0.96),
        border: `${theme.spacing(0.25)} solid ${theme.palette.text.primary}`,
        boxShadow: `${theme.spacing(0.375)} ${theme.spacing(0.375)} ${theme.alpha(theme.palette.text.primary, 0.18)}`,
        display: "grid",
        gridTemplateColumns: "auto auto",
        alignItems: "center",
        columnGap: 2,
        rowGap: 0.5,
      })}
    >
      <Typography component="dt" variant="caption" sx={{ fontWeight: 700 }}>
        ปริมาณ
      </Typography>
      <Typography
        component="dd"
        variant="caption"
        sx={{ margin: 0, fontWeight: 700 }}
      >
        {typeof label === "number" ? formatTick(label) : label} หน่วย
      </Typography>
      {visiblePayload.map((entry) => (
        <Fragment key={String(entry.dataKey)}>
          <Stack
            component="dt"
            spacing={3}
            direction="row"
            sx={(theme) => ({
              alignItems: "center",
              borderLeft: `${theme.spacing(0.25)} solid ${entry.color ?? theme.palette.text.primary}`,
              paddingLeft: 1,
            })}
          >
            <Typography component="strong" variant="caption">
              {entry.name}
            </Typography>
          </Stack>
          <Typography
            component="dd"
            variant="caption"
            sx={{ margin: 0, fontWeight: 700 }}
          >
            {typeof entry.value === "number" ? formatTick(entry.value) : "—"}{" "}
            บาท
          </Typography>
        </Fragment>
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
      component="figure"
      sx={{
        margin: 0,
        position: "relative",
        width: "100%",
        height: 390,
      }}
    >
      <Box
        component="figcaption"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          pointerEvents: "none",
        }}
      >
        {[
          { label: "อุปทาน (S)", color: t.palette.primary.main },
          { label: "อุปสงค์ (D)", color: t.palette.secondary.main },
        ].map((item) => (
          <Typography
            component="strong"
            key={item.label}
            sx={(theme) => ({
              borderLeft: `${theme.spacing(0.375)} solid ${item.color}`,
              paddingLeft: 1,
            })}
          >
            {item.label}
          </Typography>
        ))}
      </Box>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 52, right: 28, bottom: 42, left: 18 }}
        >
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
            stroke={t.palette.text.primary}
            tick={{ fill: t.palette.text.secondary, fontSize: 11 }}
            label={{
              value: "ปริมาณ (หน่วย)",
              position: "insideBottom",
              fill: t.palette.text.primary,
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
            stroke={t.palette.text.primary}
            tick={{ fill: t.palette.text.secondary, fontSize: 11 }}
            width={54}
            label={{
              value: "ราคา (บาท)",
              angle: -90,
              position: "insideLeft",
              fill: t.palette.text.primary,
              fontWeight: 700,
            }}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ stroke: t.palette.divider, strokeDasharray: "3 4" }}
          />

          {props.equilibrium !== null && (
            <>
              <ReferenceLine
                y={props.equilibrium.price}
                stroke={t.palette.secondary.main}
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
              <Scatter
                dataKey="equilibriumCost"
                name="จุดสมดุล"
                isAnimationActive={false}
                fill={t.palette.warning.main}
                stroke={t.palette.text.primary}
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
