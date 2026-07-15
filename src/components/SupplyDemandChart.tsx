import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CompleteDatasetRow } from '@/lib/supplyDemand';

type Props = {
  data: Array<CompleteDatasetRow>;
  closestBalance: CompleteDatasetRow | null;
};

export function SupplyDemandChart({ data, closestBalance }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 22, right: 24, bottom: 24, left: 12 }}>
        <CartesianGrid stroke="#b8d6e9" strokeDasharray="2 4" />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="plainline"
          wrapperStyle={{ fontWeight: 700, paddingBottom: 14 }}
        />
        <YAxis
          dataKey="cost"
          type="number"
          tickMargin={10}
          domain={['dataMin', 'dataMax']}
          stroke="#40516a"
          tick={{ fill: '#40516a', fontSize: 12 }}
        >
          <Label value="ราคา (บาท)" position="insideBottom" offset={-14} />
        </YAxis>
        <XAxis
          type="number"
          domain={['dataMin', 'dataMax']}
          tickMargin={8}
          stroke="#40516a"
          tick={{ fill: '#40516a', fontSize: 12 }}
          label={{ value: 'ปริมาณ', angle: -90, position: 'insideLeft', offset: 2 }}
        />
        <Tooltip
          isAnimationActive={false}
          contentStyle={{
            background: '#fffdf5',
            border: '2px solid #27364a',
            borderRadius: 3,
            boxShadow: '4px 4px 0 rgba(39, 54, 74, .15)',
          }}
          labelFormatter={(value) => `ราคา ${value} บาท`}
        />
        {closestBalance && (
          <ReferenceLine
            x={closestBalance.cost}
            stroke="#d84f4f"
            strokeDasharray="5 5"
            strokeWidth={1.5}
          />
        )}
        <Line
          type="linear"
          name="อุปทาน (S)"
          dataKey="supply"
          dot={{ r: 4, fill: '#fffdf5', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          stroke="#2773b8"
          strokeWidth={3}
        />
        <Line
          type="linear"
          dataKey="demand"
          name="อุปสงค์ (D)"
          dot={{ r: 4, fill: '#fffdf5', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          stroke="#d84f4f"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
