import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const TransactionsOld: AsyncComponent = () => import(/* webpackChunkName: 'transactions-old' */ '@/modules/transactions-old/pages/transactions.vue');

export const TRANSACTIONS: IRouteConfig = {
  path: '/dashboard/transactions',
  name: 'transactions',
  component: TransactionsOld,
  meta: {
    permission: [
      ROLES.administrator,
      ROLES.merchant,
      ROLES.compliance_manager,
      ROLES.compliance_specialist,
      ROLES.cashier,
      ROLES.accountant,
      ROLES.antifraud_specialist,
      ROLES.customer_support,
    ],
    translation: 'navigation.link.transactions',
    root: true,
    icon: 'icon-transactions',
  },
};
