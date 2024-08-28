import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const BasePageLayout: AsyncComponent = () => import('../../../layouts/base-page-layout.vue');
const TransactionPage: AsyncComponent = () => import('../pages/total-balance/transactions/index.vue');
const InvoicesPage: AsyncComponent = () => import('../pages/total-balance/invoices/index.vue');
const AccountPage: AsyncComponent = () => import('../pages/total-balance/accounts/index.vue');
const SummaryPage: AsyncComponent = () => import('../pages/total-balance/summary/index.vue');
const OpenBankingPage: AsyncComponent = () => import('../pages/total-balance/open-banking/index.vue');

export const ACCOUNTS_ROUTE: IRouteConfig = {
  path: 'accounts',
  name: 'user-dashboard-main-accounts',
  meta: {
    translation: 'pages.user_dashboard.links.accounts',
  },
  component: AccountPage,
};
export const TRANSACTIONS_ROUTE: IRouteConfig = {
  path: '',
  name: 'user-dashboard-transactions',
  component: TransactionPage,
  meta: {
    translation: 'pages.user_dashboard.links.transactions',
  },
};
export const INVOICES_ROUTE: IRouteConfig = {
  path: 'invoices',
  name: 'user-dashboard-invoices',
  component: InvoicesPage,
  meta: {
    translation: 'pages.invoices.invoices',
  },
};
export const TRANSACTIONS_LAYOUT_ROUTE: IRouteConfig = {
  path: 'transactions',
  name: 'user-dashboard-transactions-layout',
  meta: {
    translation: 'pages.user_dashboard.links.transactions',
  },
  component: BasePageLayout,
  children: [TRANSACTIONS_ROUTE, INVOICES_ROUTE],
  redirect: {
    name: 'user-dashboard-transactions',
  },
};
export const SUMMARY_ROUTE: IRouteConfig = {
  path: 'summary',
  name: 'user-dashboard-main-summary',
  meta: {
    translation: 'pages.user_dashboard.links.summary',
  },
  component: SummaryPage,
};

export const OPEN_BANKING_ROUTE: IRouteConfig = {
  path: 'open-banking',
  name: 'user-dashboard-open-banking',
  meta: {
    translation: 'pages.user_dashboard.links.open_banking',
  },
  component: OpenBankingPage,
};

export const TOTAL_BALANCE_CHILDREN: IRouteConfig[] = [ACCOUNTS_ROUTE, OPEN_BANKING_ROUTE, TRANSACTIONS_LAYOUT_ROUTE, SUMMARY_ROUTE];
