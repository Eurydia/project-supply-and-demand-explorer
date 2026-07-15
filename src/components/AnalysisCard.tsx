import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import { Box, Chip, Paper, Typography } from '@mui/material';
import type { SupplyDemandExplorerController } from '@/hooks/useSupplyDemandExplorer';
import { SupplyDemandChart } from './SupplyDemandChart';

type Props = Pick<
  SupplyDemandExplorerController,
  'sortedDataset' | 'closestBalance'
>;

export function AnalysisCard({ sortedDataset, closestBalance }: Props) {
  return (
    <Paper component="section" className="notebook-card chart-card">
      <Box className="card-heading chart-heading">
        <span className="step-number red">02</span>
        <Box>
          <Typography component="h2" variant="h5">
            อ่านเส้นกราฟ
          </Typography>
          <Typography className="pencil-note">
            แกนนอน = ราคา · แกนตั้ง = ปริมาณ
          </Typography>
        </Box>
        <Chip
          className="data-count"
          label={`${sortedDataset.length} จุดข้อมูล`}
          size="small"
        />
      </Box>

      <Box className="chart-paper">
        {sortedDataset.length === 0 && (
          <Box className="empty-chart">
            <AutoGraphRoundedIcon />
            <Typography component="p">กราฟกำลังรอข้อมูล...</Typography>
            <Typography component="span">
              กรอกตารางด้านซ้าย หรือกด “ลองข้อมูลตัวอย่าง”
            </Typography>
          </Box>
        )}
        <SupplyDemandChart
          data={sortedDataset}
          closestBalance={closestBalance}
        />
      </Box>

      <Box className="insight-strip">
        <Box>
          <span className="insight-label">โน้ตข้างกราฟ</span>
          <Typography component="p">
            {closestBalance
              ? `จากข้อมูลนี้ เส้นทั้งคู่เข้าใกล้กันที่สุดที่ราคา ${closestBalance.cost.toLocaleString('th-TH')} บาท`
              : 'เมื่อมีข้อมูลครบ ระบบจะช่วยชี้ราคาที่อุปสงค์และอุปทานเข้าใกล้กันที่สุด'}
          </Typography>
        </Box>
        <span className="scribble-arrow" aria-hidden="true">
          ↗
        </span>
      </Box>
    </Paper>
  );
}
