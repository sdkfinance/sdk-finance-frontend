import { ROLES } from '@/constants';
import { UserInstance } from '@/services/UserService';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

export const invoicesFilters: ITableFilter[] = [
  {
    type: 'Enumeration',
    name: 'filter.status',
    param: 'statuses',
    label: 'filter.status',
    options: {
      initiated: 'entity.invoices.status.initiated',
      pending: 'entity.invoices.status.pending',
      approved: 'entity.invoices.status.approved',
      paid: 'entity.invoices.status.paid',
      declined: 'entity.invoices.status.declined',
      expired: 'entity.invoices.status.expired',
    },
  },
  {
    type: 'String',
    name: 'filter.id',
    param: 'identifier',
    label: 'filter.id',
  },
  {
    type: 'String',
    name: 'filter.total_price',
    param: 'totalPrice',
    label: 'filter.total_price',
  },
  {
    type: 'String',
    name: 'filter.creator_id',
    param: 'createdByUserId',
    label: 'filter.creator_id',
    check: () => UserInstance.hasNoRoles([ROLES.merchant]),
  },

];
