import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';
import type { Route } from 'vue-router';

const TransactionsLayout: AsyncComponent = () => import('../layouts/transactions-layout.vue');
const TransactionsOld: AsyncComponent = () => import('../pages/transactions.vue');
const TransactionDetailsLayout: AsyncComponent = () => import('../layouts/transaction-details-layout.vue');
const TransactionDetails: AsyncComponent = () => import('../pages/transaction-details.vue');

const TRANSACTIONS_CHILDREN: IRouteConfig[] = [
  {
    path: '',
    name: 'front-office-transactions',
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
    },
  },
  {
    path: 'details/:transactionId',
    component: TransactionDetailsLayout,
    children: [
      {
        path: '',
        name: 'front-office-transaction-details',
        component: TransactionDetails,
        meta: {
          permission: [ROLES.administrator],
          translation: 'pages.transaction_details.title',
          layout: {
            breadcrumbs(route: Route) {
              return [
                {
                  name: 'transactions',
                  label: 'navigation.link.transactions',
                  params: route.params,
                },
                {
                  name: 'transaction-details',
                  label: 'pages.transaction_details.title',
                  params: route.params,
                },
              ];
            },
          },
        },
      },
    ],
  },
];

export const TRANSACTIONS: IRouteConfig = {
  path: '/dashboard/transactions',
  component: TransactionsLayout,
  meta: {
    translation: 'navigation.link.transactions',
    root: true,
    icon: 'icon-transactions',
  },
  children: TRANSACTIONS_CHILDREN,
};
