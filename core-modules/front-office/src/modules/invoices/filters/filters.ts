import { ROLES } from '@sdk5/shared/constants';
import type { IInvoicesFilter } from '@sdk5/shared/requests';
import { UserInstance } from '@sdk5/shared/services';
import type { ITableFilter } from '@sdk5/shared/types';

type TInvoiceFilterKeys = Exclude<keyof IInvoicesFilter, 'direction' | 'name'>;
export const INVOICE_TABLE_FILTER_PARAM: Record<TInvoiceFilterKeys, TInvoiceFilterKeys> = {
  statuses: 'statuses',
  identifier: 'identifier',
  totalPrice: 'totalPrice',
  currencyId: 'currencyId',
  createdByUserId: 'createdByUserId',
};

export type TInvoiceTableFilterParam = (typeof INVOICE_TABLE_FILTER_PARAM)[keyof typeof INVOICE_TABLE_FILTER_PARAM];

export interface IInvoiceTableFilter extends ITableFilter {
  param: TInvoiceTableFilterParam;
}

export const invoicesFilters: IInvoiceTableFilter[] = [
  {
    type: 'Enumeration',
    name: 'filter.status',
    param: INVOICE_TABLE_FILTER_PARAM.statuses,
    label: 'filter.status',
    options: {
      initiated: 'entity.invoices.status.initiated',
      pending: 'entity.invoices.status.pending',
      approved: 'entity.invoices.status.approved',
      paid: 'entity.invoices.status.paid',
      hidden: 'entity.invoices.status.declined',
      expired: 'entity.invoices.status.expired',
    },
  },
  {
    type: 'String',
    name: 'filter.id',
    param: INVOICE_TABLE_FILTER_PARAM.identifier,
    label: 'filter.id',
  },
  {
    type: 'String',
    name: 'filter.total_price',
    param: INVOICE_TABLE_FILTER_PARAM.totalPrice,
    label: 'filter.total_price',
  },
  {
    type: 'Select',
    name: 'filter.currency',
    param: INVOICE_TABLE_FILTER_PARAM.currencyId,
    label: 'filter.currency',
    options: {},
  },
  {
    type: 'String',
    name: 'filter.creator_id',
    param: INVOICE_TABLE_FILTER_PARAM.createdByUserId,
    label: 'filter.creator_id',
    check: () => UserInstance.hasNoRoles([ROLES.merchant]),
  },
];
