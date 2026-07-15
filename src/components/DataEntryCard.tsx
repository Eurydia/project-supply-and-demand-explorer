import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { SupplyDemandExplorerController } from '@/hooks/useSupplyDemandExplorer';
import { DatasetTable } from './DatasetTable';

type Props = Pick<
  SupplyDemandExplorerController,
  'data' | 'handleTableChange' | 'loadSampleData' | 'clearData'
>;

export function DataEntryCard({
  data,
  handleTableChange,
  loadSampleData,
  clearData,
}: Props) {
  return (
    <Paper component="section" className="notebook-card input-card">
      <Box className="card-heading">
        <span className="step-number">01</span>
        <Box>
          <Typography component="h2" variant="h5">
            จดข้อมูลลงตาราง
          </Typography>
          <Typography className="pencil-note">
            หนึ่งแถว = หนึ่งระดับราคา
          </Typography>
        </Box>
        <EditNoteRoundedIcon className="heading-doodle" />
      </Box>

      <Box className="sticky-note">
        <strong>เริ่มตรงนี้!</strong>
        <span>กรอก ราคา, อุปทาน (S) และอุปสงค์ (D)</span>
      </Box>

      <Box className="table-frame">
        <DatasetTable data={data} onChange={handleTableChange} />
      </Box>

      <Stack direction="row" className="table-actions">
        <Button
          variant="contained"
          startIcon={<ScienceRoundedIcon />}
          onClick={loadSampleData}
        >
          ลองข้อมูลตัวอย่าง
        </Button>
        <Button
          variant="text"
          color="inherit"
          startIcon={<DeleteSweepRoundedIcon />}
          onClick={clearData}
          disabled={!data.length}
        >
          ล้างตาราง
        </Button>
      </Stack>

      <Box className="teacher-line">
        <span>ชื่อผู้เรียน / ห้อง</span>
        <i />
      </Box>
    </Paper>
  );
}
