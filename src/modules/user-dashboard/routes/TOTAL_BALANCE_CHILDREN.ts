import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const BasePageLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'base-page-layout' */
  '@/layouts/base-page-layout.vue'
);
const TransactionPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-transactions' */
  '@/modules/user-dashboard/pages/total-balance/transactions/index.vue'
);
const InvoicesPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-invoices' */
  '@/modules/user-dashboard/pages/total-balance/invoices/index.vue'
);
const AccountPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-accounts' */
  '@/modules/user-dashboard/pages/total-balance/accounts/index.vue'
);
const SummaryPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-summary' */
  '@/modules/user-dashboard/pages/total-balance/summary/index.vue'
);

export const TOTAL_BALANCE_CHILDREN: IRouteConfig[] = [
  {
    path: 'accounts',
    name: 'user-dashboard-main-accounts',
    meta: {
      translation: 'pages.user_dashboard.links.accounts',
    },
    component: AccountPage,
  },
  {
    path: 'transactions',
    name: 'user-dashboard-transactions-layout',
    meta: {
      translation: 'pages.user_dashboard.links.transactions',
    },
    component: BasePageLayout,
    children: [
      {
        path: '',
        name: 'user-dashboard-transactions',
        component: TransactionPage,
        meta: {
          translation: 'pages.user_dashboard.links.transactions',
        },
      },
      {
        path: 'invoices',
        name: 'user-dashboard-invoices',
        component: InvoicesPage,
        meta: {
          translation: 'pages.transactions.corporate',
        },
      },
    ],
    redirect: {
      name: 'user-dashboard-transactions',
    },
  },
  {
    path: 'summary',
    name: 'user-dashboard-main-summary',
    meta: {
      translation: 'pages.user_dashboard.links.summary',
    },
    component: SummaryPage,
  },
  // {
  //   path: 'loans',
  //   name: 'user-dashboard-main-loans',
  //   meta: {
  //     translation: 'pages.user_dashboard.links.loans',
  //     badge: {
  //       status: 'new',
  //     },
  //   },
  //   component: AccountPage,
  // },
  // {
  //   path: 'investment',
  //   name: 'user-dashboard-main-investment',
  //   meta: {
  //     translation: 'pages.user_dashboard.links.investment',
  //     badge: {
  //       status: 'new',
  //     },
  //   },
  //   component: AccountPage,
  // },
];
