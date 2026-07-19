import Paper from '@mui/material/Paper';
import type { FC, PropsWithChildren } from 'react';

export const NotebookCard: FC<PropsWithChildren> = (props) => {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={(theme) => ({
        width: '100%',
        padding: '24px',
        backgroundImage: `linear-gradient(${theme.alpha(theme.palette.divider, 0.3)} 1px, transparent 1px)`,
        backgroundSize: '100% 26px',
        border: `2px solid ${theme.palette.text.primary}`,
        boxShadow: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.palette.divider}`,
      })}
    >
      {props.children}
    </Paper>
  );
};
