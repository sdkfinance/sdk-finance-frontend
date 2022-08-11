import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const actionsOfUsersFilters: ITableFilter[] = [
  {
    name: 'filter.id_of_action',
    placeholder: 'placeholder.input.search',
    type: 'Multiple',
    param: 'actionIds',
    label: 'filter.id_of_action',
  },
  {
    name: 'filter.id_of_user',
    placeholder: 'placeholder.input.search',
    type: 'Multiple',
    param: 'userIds',
    label: 'filter.id_of_user',
  },
  {
    type: 'Date',
    name: 'filter.date_from',
    param: 'performedAtFrom',
    label: 'filter.date',
    range: {
      type: 'from',
      param: 'performedAtTo',
    },
    placeholder: 'placeholder.input.date_from',
  },
  {
    type: 'Date',
    name: 'filter.date_to',
    param: 'performedAtTo',
    range: {
      type: 'to',
      param: 'performedAtFrom',
    },
    placeholder: 'placeholder.input.date_to',
  },
  {
    name: 'filter.ip_of_user',
    placeholder: 'placeholder.input.search',
    type: 'Multiple',
    param: 'userIps',
    label: 'filter.ip_of_user',
  },
  {
    name: 'filter.host',
    placeholder: 'placeholder.input.search',
    type: 'Multiple',
    param: 'hosts',
    label: 'filter.host',
  },
];
