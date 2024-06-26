import type { ITableFilter } from '@sdk5/shared/types';

export const contactsFilters: ITableFilter[] = [
  {
    type: 'String',
    name: 'filter.nickname',
    param: 'nickname',
    label: 'filter.nickname',
  },
  {
    type: 'String',
    name: 'filter.phone_number',
    param: 'phoneNumber',
    label: 'filter.phone_number',
  },
  {
    type: 'String',
    name: 'filter.email',
    param: 'email',
    label: 'filter.email',
  },
];
