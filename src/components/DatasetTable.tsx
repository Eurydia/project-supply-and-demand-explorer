import { HotTable } from '@handsontable/react-wrapper';
import type Handsontable from 'handsontable';
import type { DatasetRow } from '@/lib/supplyDemand';

type Props = {
  data: Array<DatasetRow>;
  onChange: (
    changes: Array<Handsontable.CellChange> | null,
    source: Handsontable.ChangeSource,
  ) => void;
};

export function DatasetTable({ data, onChange }: Props) {
  return (
    <HotTable
      data={data}
      dataSchema={{ cost: null, demand: null, supply: null }}
      columns={[
        { data: 'cost', type: 'numeric' },
        { data: 'supply', type: 'numeric' },
        { data: 'demand', type: 'numeric' },
      ]}
      colHeaders={['ราคา (บาท)', 'อุปทาน (S)', 'อุปสงค์ (D)']}
      cells={(row) => ({ className: row % 2 === 1 ? ['row-odd'] : [] })}
      afterGetRowHeader={(row, header) => {
        header.classList.toggle('row-odd', row % 2 === 1);
      }}
      themeName="ht-theme-main"
      width="100%"
      rowHeaders
      minSpareRows={1}
      minRows={7}
      height={306}
      stretchH="all"
      licenseKey="non-commercial-and-evaluation"
      columnSorting={false}
      multiColumnSorting={false}
      manualColumnMove={false}
      manualRowMove={false}
      mergeCells={false}
      afterChange={onChange}
    />
  );
}
