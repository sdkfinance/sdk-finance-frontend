import type { ITableFilter } from '@sdk5/shared/types';

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
    type: 'Range',
    name: 'filter.created_at',
    placeholder: 'filter.created_at',
    param: 'createdAtFrom',
    rangeOptions: {
      type: 'Date',
      from: {
        param: 'createdAtFrom',
        placeholder: 'placeholder.input.date_from',
      },
      to: {
        param: 'createdAtTo',
        placeholder: 'placeholder.input.date_to',
      },
    },
  },
  {
    type: 'Range',
    name: 'filter.activated_at',
    placeholder: 'filter.activated_at',
    param: 'activatedAtTo',
    rangeOptions: {
      type: 'Date',
      from: {
        param: 'activatedAtFrom',
        placeholder: 'placeholder.input.date_from',
      },
      to: {
        param: 'activatedAtTo',
        placeholder: 'placeholder.input.date_to',
      },
    },
  },
];
