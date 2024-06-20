import store from '@sdk5/shared/store';
import type { IRouteConfig } from '@sdk5/shared/types';
import { getAvailableDashboardRoutes } from '@sdk5/shared/utils';

import { CONTACTS } from './modules/contacts/routes';
import { INVOICE_PAYMENT_LINK } from './modules/invoice-payment-link/route';
import { INVOICES } from './modules/invoices/routes';
import { MY_ACCOUNTS_AND_BALANCES } from './modules/my-accounts-and-balances/routes';
import { PAYMENT_OPERATIONS } from './modules/payments/routes';
import { POINTS_OF_SALE } from './modules/points-of-sale/routes';
import { PROFILE } from './modules/profile-settings/routes';
import { TRANSACTIONS } from './modules/transactions-old/routes';
import { USER_DASHBOARD } from './modules/user-dashboard/routes';
import { VOUCHERS } from './modules/vouchers/routes';
import { WALLETS } from './modules/wallets/routes';
import { UserCoins } from './store/modules';

store.registerModule('UserCoins', UserCoins);

export { CURRENCY_EXCHANGE } from './modules/currency-exchange/routes';

export const FRONT_OFFICE_DASHBOARD_CHILDREN: IRouteConfig[] = [
  MY_ACCOUNTS_AND_BALANCES,
  WALLETS,
  CONTACTS,
  TRANSACTIONS,
  POINTS_OF_SALE,
  INVOICES,
  VOUCHERS,
  PROFILE,
].map((route) => {
  return {
    ...route,
    path: `/front-office${route.path}`,
  };
});

const FRONT_OFFICE_DASHBOARD_ROUTES: IRouteConfig = {
  path: '/dashboard',
  name: 'front-office-dashboard',
  component: () => import('./layouts/base-layout.vue'),
  redirect() {
    const availableRoutes = getAvailableDashboardRoutes(FRONT_OFFICE_DASHBOARD_CHILDREN);
    const [firstRoute] = availableRoutes;

    return firstRoute || { name: 'sign-in' };
  },
  children: FRONT_OFFICE_DASHBOARD_CHILDREN,
};

const FRONT_OFFICE_CHILDREN: IRouteConfig[] = [USER_DASHBOARD, PAYMENT_OPERATIONS, INVOICE_PAYMENT_LINK, FRONT_OFFICE_DASHBOARD_ROUTES].map(
  (route) => {
    return {
      ...route,
      path: `/front-office${route.path}`,
    };
  },
);

export const FRONT_OFFICE_ROUTES: IRouteConfig = {
  path: '/front-office',
  name: 'front-office',
  children: FRONT_OFFICE_CHILDREN,
  redirect() {
    return { name: 'sign-in' };
  },
  component: () => import('./layouts/base-page-layout.vue'),
};
