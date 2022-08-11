import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const transactionsFilters: ITableFilter[] = [
  {
    type: 'SelectDateRange',
    name: 'filter.select_daterange',
    param: 'daterange',
    params: ['createdAtFrom', 'createdAtTo'],
    label: 'filter.transactions',
    labelPosition: 'before',
  },
];
