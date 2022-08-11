import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const transfersFilters: ITableFilter[] = [
  {
    type: 'Enumeration',
    name: 'filter.status',
    param: 'statuses',
    label: 'filter.status',
    options: {
      pending: 'entity.transaction.status.pending',
      declined: 'entity.transaction.status.declined',
      processed: 'entity.transaction.status.processed',
      error: 'entity.transaction.status.error',
      rejected: 'entity.transaction.status.rejected',
    },
  },
  {
    type: 'Enumeration',
    name: 'filter.currency_code',
    param: 'currencyCodes',
    label: 'filter.currency_code',
    options: {},
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
    name: 'filter.wallet_serial',
    type: 'Multiple',
    param: 'coinSerials',
    label: 'filter.wallet_serial',
  },
  {
    name: 'filter.organization_id',
    type: 'Multiple',
    param: 'orgIds',
    folded: true,
    label: 'filter.organization_id',
  },
  {
    name: 'filter.transaction_id',
    type: 'Multiple',
    param: 'ids',
    folded: true,
    label: 'filter.transaction_id',
  },
  {
    name: 'filter.issuer_id',
    type: 'Multiple',
    param: 'issuerIds',
    folded: true,
    label: 'filter.issuer_id',
  },
  {
    name: 'filter.request_identifier',
    type: 'Multiple',
    param: 'requestIdentifiers',
    folded: true,
    label: 'filter.request_identifier',
  },
];
