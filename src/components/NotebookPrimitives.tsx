import { Box, Paper, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

type Tone = 'olive' | 'clay';

export function NotebookCard({
  children,
  tone = 'olive',
  analysis = false,
}: PropsWithChildren<{ tone?: Tone; analysis?: boolean }>) {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={(theme) => ({
        position: 'relative',
        boxSizing: 'border-box',
        display: analysis ? 'flex' : 'block',
        width: '100%',
        minWidth: 0,
        minHeight: analysis ? 570 : undefined,
        flexDirection: analysis ? 'column' : undefined,
        p: '24px',
        overflow: 'visible',
        color: theme.palette.text.primary,
        bgcolor: `${theme.palette.background.paper} !important`,
        backgroundImage:
          'linear-gradient(rgba(119, 117, 104, 0.12) 1px, transparent 1px)',
        backgroundSize: '100% 26px',
        border: `2px solid ${theme.palette.text.primary}`,
        boxShadow: '6px 6px rgba(47, 53, 46, 0.22)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 35,
          left: -14,
          width: 14,
          height: 68,
          bgcolor:
            tone === 'clay'
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
          border: `2px solid ${theme.palette.text.primary}`,
          borderRight: 0,
          borderRadius: '6px 0 0 6px',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 28,
          height: 28,
          background: `linear-gradient(225deg, ${theme.palette.background.default} 0 46%, #756f63 47% 51%, #e9dfce 52% 100%)`,
        },
        '@media (max-width: 980px)': {
          minHeight: analysis ? 600 : undefined,
        },
        '@media (max-width: 620px)': { p: '20px 14px' },
      })}
    >
      {children}
    </Paper>
  );
}

export function SectionHeading({
  step,
  tone = 'olive',
  title,
  subtitle,
  trailing,
}: {
  step: string;
  tone?: Tone;
  title: string;
  subtitle: string;
  trailing?: ReactNode;
}) {
  const clay = tone === 'clay';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '12px',
        alignItems: 'center',
        minHeight: 56,
        mb: '16px',
        '@media (max-width: 620px)': {
          gap: '9px',
          gridTemplateColumns: clay ? 'auto 1fr' : undefined,
        },
      }}
    >
      <Box
        component="span"
        sx={(theme) => {
          const border = clay
            ? theme.palette.secondary.dark
            : theme.palette.text.primary;
          return {
            display: 'grid',
            width: 44,
            height: 44,
            placeItems: 'center',
            color: '#f5f0e5',
            bgcolor: clay
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
            border: `2px solid ${border}`,
            borderRadius: '3px',
            boxShadow: `2px 2px 0 ${border}`,
            fontFamily: '"Mali", sans-serif',
            fontWeight: 700,
            transform: clay ? 'rotate(2deg)' : 'rotate(-2deg)',
          };
        }}
      >
        {step}
      </Box>
      <Box>
        <Typography
          component="h2"
          variant="h5"
          sx={{ color: '#303a31', lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        <Typography
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            fontSize: '0.82rem !important',
          })}
        >
          {subtitle}
        </Typography>
      </Box>
      {trailing}
    </Box>
  );
}
