import { Box, Stack, Typography } from "@mui/material";
import type { FC } from "react";

export const ExplorerHeader: FC = () => {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        paddingX: 4,
        paddingY: 2,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        backgroundImage: [
          `linear-gradient(90deg, transparent ${theme.spacing(5.75)}, ${theme.alpha(theme.palette.secondary.main, 0.42)} ${theme.spacing(5.875)}, transparent ${theme.spacing(6)})`,
          `linear-gradient(${theme.alpha(theme.palette.divider, 0.45)} ${theme.spacing(0.125)}, transparent ${theme.spacing(0.125)})`,
          `linear-gradient(90deg, ${theme.alpha(theme.palette.divider, 0.45)} ${theme.spacing(0.125)}, transparent ${theme.spacing(0.125)})`,
        ].join(","),
        backgroundSize: `auto, ${theme.spacing(3)} ${theme.spacing(3)}, ${theme.spacing(3)} ${theme.spacing(3)}`,
        border: `${theme.spacing(0.25)} solid ${theme.palette.text.primary}`,
        boxShadow: `${theme.spacing(0.75)} ${theme.spacing(0.75)} ${theme.alpha(theme.palette.text.primary, 0.22)}`,
      })}
    >
      <Stack component="hgroup" spacing={2}>
        <Typography
          variant="h5"
          component="p"
          sx={(theme) => ({
            margin: 0,
            width: "fit-content",
            paddingX: 3,
            paddingY: 1,
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
            borderBottomColor: theme.palette.secondary.dark,
            borderBottomStyle: "solid",
            borderBottomWidth: 4,
            transform: "rotate(-1deg)",
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
        component="aside"
        sx={(theme) => ({
          paddingX: 3,
          paddingY: 1,
          backgroundColor: theme.palette.background.paper,
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: theme.palette.primary.dark,
          transform: "rotate(4deg)",
        })}
      >
        <Stack component="p" spacing={0.5} sx={{ margin: 0 }}>
          <Typography
            component="small"
            variant="h6"
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            {`ราคา ↑`}
          </Typography>
          <Typography
            component="strong"
            variant="h6"
            sx={(theme) => ({ color: theme.palette.text.primary })}
          >
            {`Qₛ ↑ · Qd ↓`}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};
