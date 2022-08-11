import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const bankAccountFilters: ITableFilter[] = [
  {
    type: 'Enumeration',
    name: 'filter.status',
    param: 'statuses',
    label: 'filter.status',
    options: {
      PENDING: 'entity.transaction.status.pending',
      APPROVED: 'entity.transaction.status.approved',
      REJECTED: 'entity.transaction.status.rejected',
    },
  },
  {
    name: 'filter.account_number',
    type: 'String',
    param: 'bankAccountNumber',
    label: 'filter.account_number',
  },
  {
    name: 'filter.iban',
    type: 'String',
    param: 'iban',
    label: 'filter.iban',
  },
  {
    name: 'filter.bank_name',
    type: 'String',
    param: 'bankName',
    label: 'filter.bank_name',
  },
  {
    name: 'filter.swift',
    type: 'String',
    param: 'swift',
    label: 'filter.swift',
  },
];
