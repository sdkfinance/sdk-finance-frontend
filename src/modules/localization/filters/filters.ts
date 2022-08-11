import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const localizationFilters: ITableFilter[] = [
  {
    name: 'filter.key',
    label: 'filter.key',
    type: 'String',
    param: 'key',
    placeholder: 'filter.key',
  },
  {
    name: 'filter.value',
    label: 'filter.value',
    type: 'String',
    param: 'value',
    placeholder: 'filter.value',
  },
];
