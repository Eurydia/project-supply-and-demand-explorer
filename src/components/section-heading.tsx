import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import type { FC } from "react";

export const SectionHeading: FC<{
  step: string;
  tone?: "olive" | "clay";
  title: string;
}> = (props) => {
  const clay = props.tone === "clay";

  return (
    <Stack
      component="hgroup"
      spacing={2}
      direction="row"
      sx={{ alignItems: "center" }}
    >
      <Typography
        component="p"
        variant="h5"
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
            borderStyle: "solid",
            borderColor: borderColor,
            borderWidth: 2,
            borderRadius: theme.shape.borderRadius,
            boxShadow: `${theme.spacing(0.25)} ${theme.spacing(0.25)} 0 ${borderColor}`,
            transform: clay ? "rotate(2deg)" : "rotate(-2deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            color: clay
              ? theme.palette.secondary.contrastText
              : theme.palette.primary.contrastText,
          };
        }}
      >
        {props.step}
      </Typography>
      <Typography component="h2" variant="h5">
        {props.title}
      </Typography>
    </Stack>
  );
};
