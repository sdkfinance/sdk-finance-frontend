import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const invoicesFilters: ITableFilter[] = [
  {
    type: 'Select',
    name: 'filter.select',
    param: 'statuses',
    label: 'filter.statuses',
    labelPosition: 'before',
    defaultValues: {
      statuses: ['declined', 'pending', 'expired', 'paid'],
    },
    options: [
      {
        label: 'entity.invoice.status.all',
        value: ['declined', 'pending', 'expired', 'paid'],
      },
      {
        label: 'entity.invoice.status.pending',
        value: ['pending'],
      },
      {
        label: 'entity.invoice.status.paid',
        value: ['paid'],
      },
      {
        label: 'entity.invoice.status.declined',
        value: ['declined'],
      },
      {
        label: 'entity.invoice.status.expired',
        value: ['expired'],
      },
    ],
  },
];
