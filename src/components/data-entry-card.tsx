import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatasetTable } from './data-entry-table';
import { NotebookCard } from './notebook-card';
import { SectionHeading } from './section-heading';
import type { FC } from 'react';

export const DataEntryCard: FC<{
  data: Array<{
    cost: number | null;
    demand: number | null;
    supply: number | null;
  }>;
  onChange: (
    data: Array<{
      cost: number | null;
      demand: number | null;
      supply: number | null;
    }>,
  ) => unknown;
  onUndo: () => unknown;
  onRedo: () => unknown;
  onClearData: () => unknown;
  onRequestSampleData: () => unknown;
  canRedo: boolean;
  canUndo: boolean;
  errors: {
    cells: Set<{ row: number; column: 'cost' | 'demand' | 'supply' }>;
    messages: Array<string>;
  };
}> = (props) => {
  return (
    <NotebookCard>
      <Stack spacing={5}>
        <SectionHeading step="01" title="ป้อนข้อมูล" />
        <Stack spacing={1.5}>
          <Stack
            direction={'row'}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<ScienceRoundedIcon />}
              onClick={props.onRequestSampleData}
            >
              {`ใช้ข้อมูลตัวอย่าง`}
            </Button>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={props.onUndo}
                disabled={!props.canUndo}
                startIcon={<UndoRoundedIcon />}
              >
                {`ย้อนกลับ`}
              </Button>
              <Button
                endIcon={<RedoRoundedIcon />}
                onClick={props.onRedo}
                disabled={!props.canRedo}
              >
                {'ทำซ้ำ'}
              </Button>
            </Stack>
          </Stack>
          <Box
            sx={(theme) => ({
              bgcolor: 'rgba(241, 236, 223, 0.82)',
              border: `2px solid ${theme.palette.text.primary}`,
            })}
          >
            <DatasetTable
              data={props.data}
              invalidCells={props.errors.cells}
              onChange={props.onChange}
            />
          </Box>
          <Stack
            direction="row"
            sx={{
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Chip
              color="primary"
              icon={<SaveRoundedIcon />}
              label={
                <Typography variant="body1">{'บันทึกแล้วในอุปกรณ์'}</Typography>
              }
            />
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteSweepRoundedIcon color="warning" />}
              onClick={props.onClearData}
              disabled={!props.data.length}
            >
              ล้างตาราง
            </Button>
          </Stack>
        </Stack>
        {props.errors.messages.length > 0 && (
          <Alert
            severity="warning"
            variant="outlined"
            icon={<WarningAmberRoundedIcon />}
          >
            <Stack spacing={0.5}>
              {props.errors.messages.map((message) => (
                <Typography
                  key={message}
                  color="secondary"
                  sx={{ fontWeight: 700 }}
                >
                  {message}
                </Typography>
              ))}
            </Stack>
          </Alert>
        )}
      </Stack>
    </NotebookCard>
  );
};
