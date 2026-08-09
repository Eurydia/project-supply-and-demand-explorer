import { HotTable } from "@handsontable/react-wrapper";
import type { CellChange, ChangeSource } from "handsontable";
import type { FC } from "react";
import { useMemo } from "react";
import { TABLE_THEME_NAME } from "@/libs/table";

type Props = {
  data: Array<{
    cost: number | null;
    demand: number | null;
    supply: number | null;
  }>;
  invalidCells: Set<{ row: number; column: "cost" | "supply" | "demand" }>;
  onChange: (
    data: Array<{
      cost: number | null;
      demand: number | null;
      supply: number | null;
    }>,
  ) => void;
};

export const DatasetTable: FC<Props> = (props) => {
  const tableData = useMemo(
    () => props.data.map((row) => ({ ...row })),
    [props.data],
  );
  const invalidKeys = useMemo(
    () =>
      new Set(
        [...props.invalidCells].map((cell) => `${cell.row}:${cell.column}`),
      ),
    [props.invalidCells],
  );

  return (
    <HotTable
      data={tableData}
      columns={[
        { data: "cost", type: "numeric", numericFormat: { pattern: "0,0.##" } },
        {
          data: "supply",
          type: "numeric",
          numericFormat: { pattern: "0,0.##" },
        },
        {
          data: "demand",
          type: "numeric",
          numericFormat: { pattern: "0,0.##" },
        },
      ]}
      colHeaders={["ราคา (บาท)", "อุปทาน (S)", "อุปสงค์ (D)"]}
      rowHeaders
      minRows={7}
      minSpareRows={1}
      width="100%"
      height={306}
      stretchH="all"
      autoWrapRow
      autoWrapCol
      navigableHeaders
      tabNavigation
      allowInvalid
      cells={(row: number, column: number) => {
        const field = (["cost", "supply", "demand"] as const).at(column);
        return {
          valid: field ? !invalidKeys.has(`${row}:${field}`) : true,
        };
      }}
      afterChange={(
        changes: Array<CellChange> | null,
        source: ChangeSource,
      ) => {
        if (!changes || source === "loadData") {
          return;
        }

        const next = props.data.map((row) => ({ ...row }));
        changes.forEach(([rowIndex, property, , value]) => {
          while (next.length <= rowIndex) {
            next.push({ cost: null, demand: null, supply: null });
          }
          const field = String(property) as "cost" | "supply" | "demand";
          next[rowIndex] = {
            ...next[rowIndex],
            [field]: value,
          };
        });

        while (
          next.length > 0 &&
          Object.values(next.at(-1) ?? {}).every((value) => value === null)
        ) {
          next.pop();
        }
        props.onChange(next);
      }}
      themeName={TABLE_THEME_NAME}
      injectCoreCss
      licenseKey="non-commercial-and-evaluation"
    />
  );
};
