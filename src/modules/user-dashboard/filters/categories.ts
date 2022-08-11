import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const categoriesFilters: ITableFilter[] = [
  {
    type: 'Select',
    name: 'filter.select',
    param: 'statuses',
    label: 'by categories',
    labelPosition: 'after',
    defaultValues: {
      statuses: ['pending', 'processed'],
    },
    options: [
      {
        label: 'Spending',
        value: ['pending', 'processed'],
      },
      {
        label: 'Income',
        value: ['pending'],
      },
    ],
  },
];
