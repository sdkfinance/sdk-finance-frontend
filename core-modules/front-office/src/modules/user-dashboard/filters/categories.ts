import type { ITableFilter } from '@sdk5/shared/types';

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
