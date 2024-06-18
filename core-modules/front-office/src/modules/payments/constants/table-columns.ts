import type { ITableColumn } from '@sdk5/shared/types';

export const GOLD_RATES_TABLE_COLUMNS: ITableColumn[] = [
  {
    prop: 'pair',
    label: 'table.label.currency_pair',
    width: '130px',
    sortable: false,
    resizable: false,
  },
  {
    prop: 'buy',
    label: 'table.label.buy',
    width: '100px',
    sortable: false,
    resizable: false,
  },
  {
    prop: 'sell',
    label: 'table.label.sell',
    width: '100px',
    sortable: false,
    resizable: false,
  },
];
