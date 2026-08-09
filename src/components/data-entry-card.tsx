import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";
import { DatasetTable } from "./data-entry-table";
import { NotebookCard } from "./notebook-card";
import { SectionHeading } from "./section-heading";

export const DataEntryCard: FC<{
  data: Array<{
    cost: number | null;
    demand: number | null;
    supply: number | null;
  }>;
  onChange: (
    data: Array<{
      cost: number | null;
      demand: number | null;
      supply: number | null;
    }>,
  ) => unknown;
  onUndo: () => unknown;
  onRedo: () => unknown;
  onClearData: () => unknown;
  onRequestSampleData: () => unknown;
  canRedo: boolean;
  canUndo: boolean;
  errors: {
    cells: Set<{ row: number; column: "cost" | "demand" | "supply" }>;
    messages: Array<string>;
  };
}> = (props) => {
  return (
    <NotebookCard>
      <Stack component="form" spacing={5}>
        <SectionHeading step="01" title="ป้อนข้อมูล" />
        <Stack
          component="fieldset"
          spacing={1.5}
          sx={{ border: 0, margin: 0, minWidth: 0, padding: 0 }}
        >
          <Typography
            component="legend"
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
            จัดการชุดข้อมูลอุปสงค์และอุปทาน
          </Typography>
          <Stack
            component="header"
            direction="row"
            sx={{
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              variant="contained"
              startIcon={<ScienceRoundedIcon />}
              onClick={props.onRequestSampleData}
            >
              {`ใช้ข้อมูลตัวอย่าง`}
            </Button>
            <Stack
              component="fieldset"
              direction="row"
              spacing={1}
              sx={{ border: 0, margin: 0, minWidth: 0, padding: 0 }}
            >
              <Typography
                component="legend"
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
                ประวัติการแก้ไขข้อมูล
              </Typography>
              <Button
                type="button"
                onClick={props.onUndo}
                disabled={!props.canUndo}
                startIcon={<UndoRoundedIcon />}
              >
                {`ย้อนกลับ`}
              </Button>
              <Button
                type="button"
                endIcon={<RedoRoundedIcon />}
                onClick={props.onRedo}
                disabled={!props.canRedo}
              >
                {"ทำซ้ำ"}
              </Button>
            </Stack>
          </Stack>
          <Box
            component="section"
            sx={(theme) => ({
              bgcolor: theme.alpha(theme.palette.background.paper, 0.82),
              border: `${theme.spacing(0.25)} solid ${theme.palette.text.primary}`,
            })}
          >
            <Typography
              component="h3"
              sx={(theme) => ({
                position: "absolute",
                width: theme.spacing(0.125),
                height: theme.spacing(0.125),
                padding: 0,
                margin: theme.spacing(-0.125),
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
                whiteSpace: "nowrap",
                border: 0,
              })}
            >
              ตารางข้อมูลราคา อุปทาน และอุปสงค์
            </Typography>
            <DatasetTable
              data={props.data}
              invalidCells={props.errors.cells}
              onChange={props.onChange}
            />
          </Box>
          <Stack
            component="footer"
            direction="row"
            sx={{
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Chip
              color="primary"
              icon={<SaveRoundedIcon />}
              label={
                <Typography component="strong" variant="body1">
                  บันทึกแล้วในอุปกรณ์
                </Typography>
              }
            />
            <Button
              type="button"
              variant="outlined"
              color="warning"
              startIcon={<DeleteSweepRoundedIcon />}
              onClick={props.onClearData}
              disabled={!props.data.length}
            >
              ล้างตาราง
            </Button>
          </Stack>
        </Stack>
        {props.errors.messages.length > 0 && (
          <Alert
            severity="warning"
            variant="outlined"
            icon={<WarningAmberRoundedIcon />}
          >
            <Stack
              component="ul"
              spacing={0.5}
              sx={{
                margin: 0,
                paddingLeft: 2.5,
              }}
            >
              {props.errors.messages.map((message) => (
                <Typography
                  component="li"
                  key={message}
                  sx={(theme) => ({
                    color: theme.palette.secondary.main,
                    fontWeight: 700,
                  })}
                >
                  {message}
                </Typography>
              ))}
            </Stack>
          </Alert>
        )}
      </Stack>
    </NotebookCard>
  );
};
