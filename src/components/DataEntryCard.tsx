import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';
import type { SupplyDemandExplorerController } from '@/hooks/useSupplyDemandExplorer';
import { DatasetTable } from './DatasetTable';
import { NotebookCard, SectionHeading } from './NotebookPrimitives';

type Props = Pick<
  SupplyDemandExplorerController,
  | 'data'
  | 'sortedDataset'
  | 'validation'
  | 'handleTableCommit'
  | 'loadSampleData'
  | 'clearData'
  | 'undo'
  | 'redo'
  | 'canUndo'
  | 'canRedo'
>;

function DataActionButton(props: ButtonProps) {
  const contained = props.variant === 'contained';

  return (
    <Button
      {...props}
      sx={(theme) => ({
        minHeight: 38,
        px: '16px',
        color: contained ? '#fffaf0' : '#42473f',
        bgcolor: contained ? '#4f5c39' : 'transparent',
        border: contained ? '2px solid #303a27' : '2px solid transparent',
        borderRadius: '3px',
        boxShadow: contained ? '3px 3px 0 #303a27' : 'none',
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'none',
        '&:focus-visible': {
          outline: `3px solid ${theme.palette.warning.main}`,
          outlineOffset: 3,
        },
        '&:hover': contained
          ? {
              bgcolor: '#424e30',
              boxShadow: '1px 1px 0 #303a27',
              transform: 'translate(2px, 2px)',
            }
          : { bgcolor: 'rgba(47, 53, 46, 0.06)' },
        '@media (max-width: 620px)': { flex: '1 1 calc(50% - 8px)' },
      })}
    />
  );
}

function HistoryButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      sx={(theme) => ({
        color: theme.palette.primary.dark,
        bgcolor: 'rgba(246, 240, 228, 0.75)',
        border: '1px solid #8d927d',
        borderRadius: '3px',
        '&:disabled': { color: '#98998f', borderColor: '#c4bdae' },
      })}
    >
      {children}
    </IconButton>
  );
}

export function DataEntryCard({
  data,
  sortedDataset,
  validation,
  handleTableCommit,
  loadSampleData,
  clearData,
  undo,
  redo,
  canUndo,
  canRedo,
}: Props) {
  const showValidation =
    validation.messages.length > 0 || sortedDataset.length > 0;
  const dataReady =
    validation.messages.length === 0 && sortedDataset.length > 0;

  return (
    <NotebookCard>
      <SectionHeading
        step="01"
        title="ป้อนข้อมูล"
        subtitle="หนึ่งแถว = หนึ่งระดับราคา"
        trailing={
          <EditNoteRoundedIcon
            sx={(theme) => ({
              boxSizing: 'content-box',
              width: '24px !important',
              height: '24px !important',
              p: '5px',
              color: theme.palette.secondary.main,
              border: `2px dashed ${theme.palette.secondary.main}`,
              borderRadius: '50%',
            })}
          />
        }
      />

      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          m: '4px 0 17px',
          p: '10px 14px',
          color: '#413e34',
          bgcolor: 'rgba(216, 189, 128, 0.2)',
          border: '2px dotted #8d7246',
          borderLeft: `6px solid ${theme.palette.warning.main}`,
          fontSize: '0.8rem',
        })}
      >
        <Typography
          component="strong"
          sx={{ fontFamily: '"Mali", sans-serif', fontSize: '0.92rem' }}
        >
          รูปแบบข้อมูล
        </Typography>
        <Typography component="span" sx={{ fontSize: '0.8rem' }}>
          ระบุราคา อุปทาน (S) และอุปสงค์ (D) ในแต่ละแถว
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'rgba(241, 236, 223, 0.82)',
          border: `2px solid ${theme.palette.text.primary}`,
        })}
      >
        <DatasetTable
          data={data}
          invalidCells={validation.invalidCells}
          onCommit={handleTableCommit}
        />
      </Box>

      <Stack
        direction="row"
        sx={{ flexWrap: 'wrap', gap: '12px', alignItems: 'center', mt: '18px' }}
      >
        <DataActionButton
          variant="contained"
          startIcon={<ScienceRoundedIcon />}
          onClick={loadSampleData}
        >
          ใช้ข้อมูลตัวอย่าง
        </DataActionButton>
        <DataActionButton
          variant="text"
          color="inherit"
          startIcon={<DeleteSweepRoundedIcon />}
          onClick={clearData}
          disabled={!data.length}
        >
          ล้างตาราง
        </DataActionButton>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          mt: '12px',
          '@media (max-width: 460px)': {
            alignItems: 'flex-start',
            flexDirection: 'column',
          },
        }}
      >
        <Stack direction="row" sx={{ gap: '4px' }}>
          <HistoryButton label="ย้อนกลับ" onClick={undo} disabled={!canUndo}>
            <UndoRoundedIcon />
          </HistoryButton>
          <HistoryButton label="ทำซ้ำ" onClick={redo} disabled={!canRedo}>
            <RedoRoundedIcon />
          </HistoryButton>
        </Stack>
        <Chip
          icon={<SaveRoundedIcon />}
          label="บันทึกอัตโนมัติในอุปกรณ์"
          size="small"
          sx={{
            color: '#48503b',
            bgcolor: '#dde0cf',
            border: '1px solid #8d927d',
            borderRadius: '3px',
            fontSize: '0.68rem',
          }}
        />
      </Box>

      {showValidation && (
        <Box
          aria-live="polite"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '10px',
            alignItems: 'start',
            mt: '18px',
            p: '11px 13px',
            color: dataReady ? '#37422e' : '#5a352b',
            bgcolor: dataReady ? '#dfe3d2' : '#edd8ca',
            border: `2px solid ${dataReady ? '#737d60' : '#a76b57'}`,
            fontSize: '0.78rem',
          }}
        >
          {dataReady ? (
            <CheckCircleRoundedIcon sx={{ mt: '1px', fontSize: '1.2rem' }} />
          ) : (
            <WarningAmberRoundedIcon sx={{ mt: '1px', fontSize: '1.2rem' }} />
          )}
          <Box>
            <Typography
              component="strong"
              sx={{
                display: 'block',
                mb: '2px',
                fontFamily: '"Mali", sans-serif',
                fontSize: '0.78rem',
              }}
            >
              {dataReady ? 'ข้อมูลพร้อมวิเคราะห์' : 'ตรวจสอบข้อมูล'}
            </Typography>
            {validation.messages.map((message) => (
              <Typography
                component="p"
                key={message}
                sx={{ fontSize: '0.74rem', lineHeight: 1.55 }}
              >
                {message}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </NotebookCard>
  );
}
