import { Box, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import type { FC } from 'react';

export const ExplorerHeader: FC = memo(
  () => {
    return (
      <Box
        component="header"
        sx={(theme) => ({
          paddingX: 4,
          paddingY: 2,
          color: theme.palette.text.primary,
          bgcolor: `${theme.palette.background.paper} !important`,
          backgroundImage: [
            'linear-gradient(90deg, transparent 46px, rgba(165, 101, 78, 0.42) 47px, transparent 48px)',
            'linear-gradient(rgba(119, 117, 104, 0.16) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(119, 117, 104, 0.16) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: 'auto, 24px 24px, 24px 24px',
          border: `2px solid ${theme.palette.text.primary}`,
          boxShadow: '6px 6px rgba(47, 53, 46, 0.22)',
        })}
      >
        <Stack
          direction={'row'}
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Stack spacing={2}>
            <Typography
              variant="h5"
              component={'span'}
              sx={(t) => ({
                width: 'fit-content',
                paddingX: 3,
                padding: 1,
                color: t.palette.secondary.contrastText,
                backgroundColor: t.palette.secondary.main,
                borderBottomColor: t.palette.secondary.dark,
                borderBottomStyle: 'solid',
                borderBottomWmdth: 4,
                transform: 'rotate(-1deg)',
                fontWeight: 900,
              })}
            >
              SUPPLY / DEMAND
            </Typography>
            <Typography component="h1" variant="h2">
              สำรวจอุปสงค์–อุปทาน
            </Typography>
          </Stack>
          <Box
            sx={(theme) => ({
              paddingX: 3,
              paddingY: 1,
              backgroundColor: theme.palette.background.paper,
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: theme.palette.primary.dark,
              transform: 'rotate(4deg)',
            })}
          >
            <Stack spacing={0.5}>
              <Typography component="span" variant="h6" color="textSecondary">
                {`ราคา ↑`}
              </Typography>
              <Typography component="strong" color="textPrimary" variant="h6">
                {`Qₛ ↑ · Qd ↓`}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  },
  () => true,
);
