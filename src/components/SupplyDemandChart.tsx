import { Box } from '@mui/material';
import type {
  CompleteDatasetRowWithIndex,
  Equilibrium,
} from '@/lib/supplyDemand';

const CHART_WIDTH = 820;
const CHART_HEIGHT = 430;
const CHART_MARGIN = { top: 54, right: 34, bottom: 58, left: 68 };
const PLOT_WIDTH = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
const PLOT_HEIGHT = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;
const SUPPLY_COLOR = '#59663e';
const DEMAND_COLOR = '#96513e';
const GRID_COLOR = '#b6ad9b';
const CLAY_COLOR = '#95543f';
const OCHRE_COLOR = '#b88f4f';
const INK_COLOR = '#2f352e';
const PAPER_COLOR = '#f6f0e4';

const formatTick = (value: number) =>
  value.toLocaleString('th-TH', { maximumFractionDigits: 1 });

function createTicks(minimum: number, maximum: number, count = 6) {
  return Array.from(
    { length: count },
    (_, index) => minimum + ((maximum - minimum) * index) / (count - 1),
  );
}

type Props = {
  data: Array<CompleteDatasetRowWithIndex>;
  equilibrium: Equilibrium | null;
};

export function SupplyDemandChart({ data, equilibrium }: Props) {
  if (data.length === 0) return null;

  const prices = data.map((row) => row.cost);
  const quantities = data.flatMap((row) => [row.supply, row.demand]);
  if (equilibrium) {
    prices.push(equilibrium.price);
    quantities.push(equilibrium.quantity);
  }

  const minimumPrice = Math.min(...prices);
  const maximumPrice = Math.max(...prices);
  const minimumQuantity = Math.min(...quantities);
  const maximumQuantity = Math.max(...quantities);
  const priceSpan =
    maximumPrice - minimumPrice || Math.max(Math.abs(maximumPrice), 1);
  const quantitySpan =
    maximumQuantity - minimumQuantity || Math.max(Math.abs(maximumQuantity), 1);
  const chartMinimumPrice = minimumPrice - priceSpan * 0.04;
  const chartMaximumPrice = maximumPrice + priceSpan * 0.04;
  const chartMinimumQuantity = minimumQuantity - quantitySpan * 0.08;
  const chartMaximumQuantity = maximumQuantity + quantitySpan * 0.08;

  const toX = (value: number) =>
    CHART_MARGIN.left +
    ((value - chartMinimumPrice) / (chartMaximumPrice - chartMinimumPrice)) *
      PLOT_WIDTH;
  const toY = (value: number) =>
    CHART_MARGIN.top +
    PLOT_HEIGHT -
    ((value - chartMinimumQuantity) /
      (chartMaximumQuantity - chartMinimumQuantity)) *
      PLOT_HEIGHT;

  const priceTicks = createTicks(minimumPrice, maximumPrice);
  const quantityTicks = createTicks(minimumQuantity, maximumQuantity);
  const supplyPoints = data
    .map((row) => `${toX(row.cost)},${toY(row.supply)}`)
    .join(' ');
  const demandPoints = data
    .map((row) => `${toX(row.cost)},${toY(row.demand)}`)
    .join(' ');

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      role="img"
      aria-label="กราฟเปรียบเทียบอุปทานและอุปสงค์ตามระดับราคา"
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        minHeight: 360,
        overflow: 'visible',
        fontFamily: '"Noto Sans Thai", system-ui, sans-serif',
        '@media (max-width: 620px)': { minHeight: 320 },
      }}
    >
      <g aria-hidden="true">
        <line
          x1="560"
          y1="24"
          x2="596"
          y2="24"
          stroke={SUPPLY_COLOR}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text x="604" y="29" fill="#343a33" fontSize="12" fontWeight="700">
          อุปทาน (S)
        </text>
        <line
          x1="682"
          y1="24"
          x2="718"
          y2="24"
          stroke={DEMAND_COLOR}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text x="726" y="29" fill="#343a33" fontSize="12" fontWeight="700">
          อุปสงค์ (D)
        </text>
      </g>

      {quantityTicks.map((tick, index) => {
        const y = toY(tick);
        return (
          <g key={`y-${index}`}>
            <line
              x1={CHART_MARGIN.left}
              x2={CHART_WIDTH - CHART_MARGIN.right}
              y1={y}
              y2={y}
              stroke={GRID_COLOR}
              strokeWidth="1"
              strokeDasharray="2 5"
            />
            <text
              x={CHART_MARGIN.left - 12}
              y={y + 4}
              textAnchor="end"
              fill="#454a42"
              fontSize="11"
            >
              {formatTick(tick)}
            </text>
          </g>
        );
      })}

      {priceTicks.map((tick, index) => {
        const x = toX(tick);
        return (
          <g key={`x-${index}`}>
            <line
              x1={x}
              x2={x}
              y1={CHART_MARGIN.top}
              y2={CHART_HEIGHT - CHART_MARGIN.bottom}
              stroke={GRID_COLOR}
              strokeWidth="1"
              strokeDasharray="2 5"
            />
            <text
              x={x}
              y={CHART_HEIGHT - CHART_MARGIN.bottom + 24}
              textAnchor="middle"
              fill="#454a42"
              fontSize="11"
            >
              {formatTick(tick)}
            </text>
          </g>
        );
      })}

      <line
        x1={CHART_MARGIN.left}
        x2={CHART_MARGIN.left}
        y1={CHART_MARGIN.top}
        y2={CHART_HEIGHT - CHART_MARGIN.bottom}
        stroke="#424940"
        strokeWidth="1.7"
      />
      <line
        x1={CHART_MARGIN.left}
        x2={CHART_WIDTH - CHART_MARGIN.right}
        y1={CHART_HEIGHT - CHART_MARGIN.bottom}
        y2={CHART_HEIGHT - CHART_MARGIN.bottom}
        stroke="#424940"
        strokeWidth="1.7"
      />
      <text
        x={CHART_MARGIN.left + PLOT_WIDTH / 2}
        y={CHART_HEIGHT - 12}
        textAnchor="middle"
        fill="#343a33"
        fontSize="12"
        fontWeight="700"
      >
        ราคา (บาท)
      </text>
      <text
        x="18"
        y={CHART_MARGIN.top + PLOT_HEIGHT / 2}
        textAnchor="middle"
        transform={`rotate(-90 18 ${CHART_MARGIN.top + PLOT_HEIGHT / 2})`}
        fill="#343a33"
        fontSize="12"
        fontWeight="700"
      >
        ปริมาณ (หน่วย)
      </text>

      {equilibrium && (
        <g>
          <line
            x1={toX(equilibrium.price)}
            x2={toX(equilibrium.price)}
            y1={CHART_MARGIN.top}
            y2={CHART_HEIGHT - CHART_MARGIN.bottom}
            stroke={CLAY_COLOR}
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <circle
            cx={toX(equilibrium.price)}
            cy={toY(equilibrium.quantity)}
            r="7"
            fill={OCHRE_COLOR}
            stroke={INK_COLOR}
            strokeWidth="2"
          >
            <title>
              จุดสมดุล: ราคา {formatTick(equilibrium.price)} บาท, ปริมาณ{' '}
              {formatTick(equilibrium.quantity)} หน่วย
            </title>
          </circle>
        </g>
      )}

      <polyline
        points={supplyPoints}
        fill="none"
        stroke={SUPPLY_COLOR}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={demandPoints}
        fill="none"
        stroke={DEMAND_COLOR}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {data.map((row) => (
        <g key={row.rowIndex}>
          <circle
            cx={toX(row.cost)}
            cy={toY(row.supply)}
            r="4.5"
            fill={PAPER_COLOR}
            stroke={SUPPLY_COLOR}
            strokeWidth="2.2"
          >
            <title>
              ราคา {formatTick(row.cost)} บาท, อุปทาน {formatTick(row.supply)}{' '}
              หน่วย
            </title>
          </circle>
          <circle
            cx={toX(row.cost)}
            cy={toY(row.demand)}
            r="4.5"
            fill={PAPER_COLOR}
            stroke={DEMAND_COLOR}
            strokeWidth="2.2"
          >
            <title>
              ราคา {formatTick(row.cost)} บาท, อุปสงค์ {formatTick(row.demand)}{' '}
              หน่วย
            </title>
          </circle>
        </g>
      ))}
    </Box>
  );
}
