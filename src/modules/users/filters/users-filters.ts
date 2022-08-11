import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const usersFilters: ITableFilter[] = [
  {
    name: 'filter.name_email_phone',
    label: 'filter.name_email_phone',
    type: 'String',
    param: 'text',
    placeholder: 'filter.search',
  },
  {
    name: 'filter.user_ban_status',
    label: 'filter.user_ban_status',
    placeholder: 'placeholder.select.choose_status',
    type: 'Select',
    param: 'banned',
    options: [
      {
        label: 'entity.user.banned',
        value: true,
      },
      {
        label: 'entity.user.unbanned',
        value: false,
      },
    ],
  },
];
