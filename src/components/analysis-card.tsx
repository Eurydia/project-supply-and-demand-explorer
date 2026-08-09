import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";
import { NotebookCard } from "./notebook-card";
import { SectionHeading } from "./section-heading";
import { SupplyDemandChart } from "./supply-demand-chart";

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
      <Stack component="section" spacing={3}>
        <Stack
          component="header"
          direction={"row"}
          spacing={3}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
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
          component="section"
          sx={(theme) => ({
            position: "relative",
            flex: 1,
            minHeight: 390,
            overflow: "hidden",
            bgcolor: theme.alpha(theme.palette.background.paper, 0.88),
            backgroundImage: `linear-gradient(${theme.alpha(theme.palette.divider, 0.45)} ${theme.spacing(0.125)}, transparent ${theme.spacing(0.125)}), linear-gradient(90deg, ${theme.alpha(theme.palette.divider, 0.45)} ${theme.spacing(0.125)}, transparent ${theme.spacing(0.125)})`,
            backgroundSize: `${theme.spacing(2.75)} ${theme.spacing(2.75)}`,
            border: `${theme.spacing(0.25)} solid ${theme.palette.text.primary}`,
          })}
        >
          <Typography
            component="h3"
            sx={{
              clip: "rect(0 0 0 0)",
              height: 1,
              margin: -1,
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              whiteSpace: "nowrap",
              width: 1,
            }}
          >
            กราฟอุปสงค์ อุปทาน และจุดดุลยภาพ
          </Typography>
          {props.dataset.length === 0 && (
            <Stack
              component="p"
              sx={(theme) => ({
                margin: 0,
                position: "absolute",
                bgcolor: theme.alpha(theme.palette.background.paper, 0.86),
                pointerEvents: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              })}
            >
              <Typography variant="h5" component="strong">
                ยังไม่มีข้อมูลให้แสดงผล
              </Typography>
              <Typography
                variant="h6"
                component="small"
                sx={(theme) => ({ color: theme.palette.text.secondary })}
              >
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
