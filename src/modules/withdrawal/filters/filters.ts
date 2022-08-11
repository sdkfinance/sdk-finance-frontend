import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const withdrawalFilters: ITableFilter[] = [
  {
    type: 'Date',
    name: 'filter.date_from',
    param: 'startCreatedDate',
    label: 'filter.created_at',
    range: {
      type: 'from',
      param: 'finishCreatedDate',
    },
    placeholder: 'placeholder.input.date_from',
  },
  {
    type: 'Date',
    name: 'filter.date_to',
    param: 'finishCreatedDate',
    range: {
      type: 'to',
      param: 'startCreatedDate',
    },
    placeholder: 'placeholder.input.date_to',
  },
  {
    name: 'filter.serial',
    type: 'Multiple',
    param: 'coinSerials',
    label: 'filter.serial',
  },
  {
    name: 'filter.organization_id',
    type: 'Multiple',
    param: 'orgIds',
    label: 'filter.organization_id',
  },
  {
    type: 'Enumeration',
    name: 'filter.status',
    param: 'requestStatuses',
    label: 'filter.status',
    options: {
      pending: 'entity.transaction.status.pending',
      declined: 'entity.transaction.status.declined',
      processed: 'entity.transaction.status.processed',
      error: 'entity.transaction.status.error',
      rejected: 'entity.transaction.status.rejected',
    },
  },
];
