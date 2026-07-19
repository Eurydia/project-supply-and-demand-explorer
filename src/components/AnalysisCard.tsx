import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { NotebookCard } from './notebook-card';
import { SupplyDemandChart } from './SupplyDemandChart';
import { SectionHeading } from './section-heading';
import type { SupplyDemandExplorerController } from '@/hooks/use-supply-demand-controller';
import { formatMetric } from '@/utils/format';

type Props = Pick<
  SupplyDemandExplorerController,
  'sortedDataset' | 'equilibrium'
>;

export function AnalysisCard({ sortedDataset, equilibrium }: Props) {
  const equilibriumMessage = equilibrium
    ? equilibrium.exact
      ? 'พบจุดตัดตรงกับข้อมูลที่แสดง'
      : 'ประมาณค่าจุดตัดด้วยการแทรกค่าระหว่างจุดข้อมูล'
    : sortedDataset.length >= 2
      ? 'ไม่พบจุดตัดภายในช่วงราคาของข้อมูลชุดนี้'
      : 'ต้องมีข้อมูลครบอย่างน้อยสองจุดเพื่อคำนวณจุดตัด';

  const metrics = equilibrium
    ? [
        { label: 'ราคา บาท', value: equilibrium.price },
        { label: 'ปริมาณ หน่วย', value: equilibrium.quantity },
      ]
    : [];

  return (
    <NotebookCard>
      <Stack spacing={3}>
        <SectionHeading step="02" tone="clay" title="ผลการวิเคราะห์" />
        <Chip
          label={`${sortedDataset.length} จุดข้อมูล`}
          size="small"
          sx={{
            color: '#303727',
            bgcolor: '#d3d8bf',
            border: '2px solid #778064',
            borderRadius: '3px',
          }}
        />

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
          {sortedDataset.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: '24px',
                color: '#3f473c',
                bgcolor: 'rgba(246, 240, 228, 0.86)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <AutoGraphRoundedIcon
                sx={(theme) => ({
                  color: theme.palette.primary.main,
                  transform: 'rotate(-3deg)',
                })}
              />
              <Typography component="p">ยังไม่มีข้อมูลสำหรับแสดงผล</Typography>
              <Typography component="span" color="textSecondary">
                ป้อนข้อมูลในตาราง หรือเลือก “ใช้ข้อมูลตัวอย่าง”
              </Typography>
            </Box>
          )}
          <SupplyDemandChart data={sortedDataset} equilibrium={equilibrium} />
        </Box>

        <Box
          sx={(theme) => ({
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: '18px',
            alignItems: 'center',
            mt: '16px',
            p: '12px 18px',
            color: '#4c342d',
            bgcolor: '#ead5c7',
            border: '2px solid #a97b67',
            borderLeft: `6px solid ${theme.palette.secondary.main}`,
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 24,
              bottom: -11,
              width: 18,
              height: 18,
              bgcolor: '#ead5c7',
              borderRight: '2px solid #a97b67',
              borderBottom: '2px solid #a97b67',
              transform: 'rotate(45deg)',
            },
            '@media (max-width: 620px)': { gridTemplateColumns: '1fr' },
          })}
        >
          <Box>
            <Box
              component="span"
              sx={{
                display: 'block',
                mb: '2px',
                color: '#5d382d',
                fontFamily: '"Mali", sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              จุดสมดุล
            </Box>
            <Typography
              component="p"
              sx={{ fontSize: '0.84rem', lineHeight: 1.55 }}
            >
              {equilibriumMessage}
            </Typography>
          </Box>
          {equilibrium && (
            <Stack>
              {metrics.map((metric) => (
                <Box
                  key={metric.label}
                  component="span"
                  sx={{
                    p: '6px 10px',
                    bgcolor: 'rgba(246, 240, 228, 0.64)',
                    border: '1px solid #9a745f',
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    component="small"
                    sx={{
                      color: '#6b5147',
                    }}
                  >
                    {metric.label}
                  </Typography>
                  <Typography component="strong" color="primary">
                    {formatMetric(metric.value)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </NotebookCard>
  );
}
