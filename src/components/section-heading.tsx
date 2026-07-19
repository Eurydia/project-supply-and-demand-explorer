import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';

export const SectionHeading: FC<{
  step: string;
  tone?: 'olive' | 'clay';
  title: string;
}> = (props) => {
  const clay = props.tone === 'clay';

  return (
    <Stack spacing={2} direction={'row'} sx={{ alignItems: 'center' }}>
      <Box
        sx={(theme) => {
          const borderColor = clay
            ? theme.palette.secondary.dark
            : theme.palette.text.primary;
          return {
            width: 45,
            height: 45,
            bgcolor: clay
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
            borderStyle: 'solid',
            borderColor: borderColor,
            borderWidth: 2,
            borderRadius: theme.shape.borderRadius,
            boxShadow: `2px 2px 0 ${borderColor}`,
            transform: clay ? 'rotate(2deg)' : 'rotate(-2deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
        }}
      >
        <Typography
          component={'span'}
          variant="h5"
          sx={(t) => ({
            color: clay
              ? t.palette.secondary.contrastText
              : t.palette.primary.contrastText,
          })}
        >
          {props.step}
        </Typography>
      </Box>
      <Typography component="h2" variant="h5">
        {props.title}
      </Typography>
    </Stack>
  );
};
