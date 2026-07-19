import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NotebookCard } from './notebook-card';
import { SupplyDemandChart } from './SupplyDemandChart';
import { SectionHeading } from './section-heading';
import type { FC } from 'react';

export const AnalysisCard: FC<{
  equilibrium: {
    quantity: number;
    price: number;
    exact: boolean;
  } | null;
  dataset: Array<{
    rowIndex: number;
    supply: number;
    demand: number;
    cost: number;
  }>;
}> = (props) => {
  return (
    <NotebookCard>
      <Stack spacing={3}>
        <Stack
          direction={'row'}
          spacing={3}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <SectionHeading step="02" tone="clay" title="ผลการวิเคราะห์" />
          <Chip
            label={`${props.dataset.length} จุดข้อมูล`}
            color="primary"
            variant="outlined"
            sx={(t) => ({
              borderRadius: t.shape.borderRadius,
            })}
          />
        </Stack>

        <Box
          sx={(theme) => ({
            position: 'relative',
            flex: 1,
            minHeight: 390,
            overflow: 'hidden',
            bgcolor: 'rgba(246, 240, 228, 0.88)',
            backgroundImage:
              'linear-gradient(rgba(119, 117, 104, 0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(119, 117, 104, 0.13) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            border: `2px solid ${theme.palette.text.primary}`,
          })}
        >
          {props.dataset.length === 0 && (
            <Stack
              sx={{
                position: 'absolute',
                bgcolor: 'rgba(246, 240, 228, 0.86)',
                pointerEvents: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Typography variant="h5" component={'span'}>
                ยังไม่มีข้อมูให้แสดงผล
              </Typography>
              <Typography color="textSecondary" variant="h6" component={'span'}>
                ป้อนข้อมูลในตาราง หรือเลือก “ใช้ข้อมูลตัวอย่าง”
              </Typography>
            </Stack>
          )}
          <SupplyDemandChart
            data={props.dataset}
            equilibrium={props.equilibrium}
          />
        </Box>
      </Stack>
    </NotebookCard>
  );
};
