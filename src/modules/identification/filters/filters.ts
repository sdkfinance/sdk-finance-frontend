import { ROLES_ARRAY } from '@/constants';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

const getRoles = () => ROLES_ARRAY.reduce((acc, { label, value }) => ({ ...acc, [value]: label }), {});

export const identificationFilters: ITableFilter[] = [
  {
    name: 'filter.text',
    type: 'String',
    param: 'text',
    label: 'filter.text',
  },
  {
    name: 'filter.email',
    type: 'String',
    param: 'email',
    label: 'filter.email',
  },
  {
    name: 'filter.phone',
    type: 'String',
    param: 'phone',
    label: 'filter.phone',
  },
  {
    name: 'filter.role',
    type: 'Enumeration',
    param: 'roles',
    label: 'filter.role',
    options: getRoles(),
  },
];
