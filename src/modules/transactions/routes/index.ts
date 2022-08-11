import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const BasePageLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue'
);
const Transactions: AsyncComponent = () => import(
  /* webpackChunkName: 'transactions' */ '@/modules/transactions/pages/transactions.vue'
);
const TransactionsIndividuals: AsyncComponent = () => import(
  /* webpackChunkName: 'transactions-individuals' */ '@/modules/transactions/pages/individual-transactions.vue'
);
const TransactionDetails: AsyncComponent = () => import(
  /* webpackChunkName: 'transactions-details' */ '@/modules/transactions/pages/transaction-details.vue'
);

export const TRANSACTIONS_CHILDREN: IRouteConfig[] = [
  {
    path: '',
    name: 'transactions-main',
    component: Transactions,
    children: [
      {
        path: 'individuals',
        name: 'transactions-individuals',
        component: TransactionsIndividuals,
        meta: {
          translation: 'pages.transactions.individuals',
        },
      },
      {
        path: 'corporate',
        name: 'transactions-corporate',
        component: Transactions,
        meta: {
          translation: 'pages.transactions.corporate',
        },
      },
    ],
    redirect: {
      name: 'transactions-individuals',
    },
    meta: {
      layout: {
        breadcrumbs: {
          parent: 'transactions',
        },
      },
    },
  },
  {
    path: 'transaction-details/:id',
    name: 'transaction-details',
    component: TransactionDetails,
    meta: {
      layout: {
        props: {
          backName: 'transactions-main',
        },
        breadcrumbs: {
          parent: 'transactions',
        },
      },
    },
  },
];

export const TRANSACTIONS_NEW: IRouteConfig = {
  path: '/dashboard/transactions-new',
  name: 'transactions-new',
  component: BasePageLayout,
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
    translation: 'navigation.link.transactions_new',
    root: true,
    icon: 'icon-transactions',
  },
  children: TRANSACTIONS_CHILDREN,
  redirect: TRANSACTIONS_CHILDREN[0],
};
