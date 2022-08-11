import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const kycFilters: ITableFilter[] = [
  {
    name: 'filter.application_status',
    label: 'filter.application_status',
    placeholder: 'placeholder.select.choose_status',
    type: 'Select',
    param: 'identificationStatus',
    defaultValues: {
      identificationStatus: 'pending',
    },
    options: [
      {
        label: 'entity.identification_status.pending',
        value: 'pending',
      },
      {
        label: 'entity.identification_status.approved',
        value: 'approved',
      },
      {
        label: 'entity.identification_status.declined',
        value: 'declined',
      },
      {
        label: 'entity.identification_status.none',
        value: 'none',
      },
    ],
  },
  {
    name: 'filter.search',
    label: 'filter.search',
    type: 'String',
    param: 'text',
    placeholder: 'filter.search',
    suffixIcon: 'icon-search',
  },
];
