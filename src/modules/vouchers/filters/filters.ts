import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const vouchersFilters: ITableFilter[] = [
  {
    type: 'Select',
    name: 'filter.activated',
    param: 'activated',
    label: 'filter.activated',
    options: [
      {
        label: 'filter.activated',
        value: true,
      },
      {
        label: 'filter.not_activated',
        value: false,
      },
    ],
  },
  {
    type: 'Date',
    name: 'filter.date_from',
    param: 'createdAtFrom',
    label: 'filter.created_at',
    range: {
      type: 'from',
      param: 'createdAtTo',
    },
    placeholder: 'placeholder.input.date_from',
  },
  {
    type: 'Date',
    name: 'filter.date_to',
    param: 'createdAtTo',
    range: {
      type: 'to',
      param: 'createdAtFrom',
    },
    placeholder: 'placeholder.input.date_to',
  },
  {
    type: 'Date',
    name: 'filter.date_from',
    param: 'activatedAtFrom',
    label: 'filter.activated_at',
    range: {
      type: 'from',
      param: 'activatedAtTo',
    },
    placeholder: 'placeholder.input.date_from',
  },
  {
    type: 'Date',
    name: 'filter.date_to',
    param: 'activatedAtTo',
    range: {
      type: 'to',
      param: 'activatedAtFrom',
    },
    placeholder: 'placeholder.input.date_to',
  },
];
