import Paper from "@mui/material/Paper";
import type { FC, PropsWithChildren } from "react";

export const NotebookCard: FC<PropsWithChildren> = (props) => {
  return (
    <Paper
      component="article"
      elevation={0}
      sx={(theme) => ({
        width: "100%",
        padding: theme.spacing(3),
        backgroundImage: `linear-gradient(${theme.alpha(theme.palette.divider, 0.3)} ${theme.spacing(0.125)}, transparent ${theme.spacing(0.125)})`,
        backgroundSize: `100% ${theme.spacing(3.25)}`,
        border: `${theme.spacing(0.25)} solid ${theme.palette.text.primary}`,
        boxShadow: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.palette.divider}`,
      })}
    >
      {props.children}
    </Paper>
  );
};
