import { ACTIONS_OF_USERS } from '@/modules/actions-of-users/routes';
// import { ANOMALY_ANALYSIS } from '@/modules/anomaly-analysis/routes';
import { BANK_ACCOUNTS } from '@/modules/bank-accounts/routes';
import { CONTACTS } from '@/modules/contacts/routes';
import { CONTRACTS_OLD } from '@/modules/contracts-old/routes';
import { CURRENCIES } from '@/modules/currency/routes';
// import { LOCALIZATION } from '@/modules/localization/routes';
import { GATE_SETTINGS } from '@/modules/gate-settings/routes';
import { IDENTIFICATION } from '@/modules/identification/routes';
// import { TRANSACTIONS_NEW } from '@/modules/transactions/routes';
import { INVOICES } from '@/modules/invoices/routes';
import { KYC } from '@/modules/kyc/routes';
import { POINTS_OF_SALE } from '@/modules/points-of-sale/routes';
import { PROFILE } from '@/modules/profile-settings/routes';
// import { CURRENCY_EXCHANGE } from '@/modules/currency-exchange/routes';
import { SYSTEM_OPERATIONS } from '@/modules/system-operations/routes';
import { TOP_UP } from '@/modules/top-up/routes';
import { TRANSACTIONS } from '@/modules/transactions-old/routes';
import { USER_PROFILE } from '@/modules/user-profile/routes';
import { USERS } from '@/modules/users/routes';
// import { TRANSFERS } from '@/modules/transfers/routes';
import { VOUCHERS } from '@/modules/vouchers/routes';
// import { CONTRACTS } from '@/modules/contracts/routes';
import { WALLETS } from '@/modules/wallets/routes';
import { WITHDRAWAL } from '@/modules/withdrawal/routes';
// import { CUSTOMERS } from '@/modules/customers/routes';
// import { VARIABLES } from '@/modules/variables/routes';
// import { PIN_RECOVERY } from '@/modules/pin-recovery/routes';
import { checkPermission } from '@/router/middlewares/permissionGuard';
import { IRouteConfig } from '@/types/interfaces';

const BaseLayout = () => import(/* webpackChunkName: 'dashboard' */ '@/layouts/base-layout.vue');

// @ts-ignore
export const DASHBOARD_ROUTES: IRouteConfig[] = [
  USERS,
  // ...CUSTOMERS,
  WALLETS,
  CONTACTS,
  KYC,
  POINTS_OF_SALE,
  ACTIONS_OF_USERS,
  CONTRACTS_OLD,
  // CONTRACTS,
  TRANSACTIONS,
  // TRANSACTIONS_NEW,
  INVOICES,
  // TRANSFERS,
  VOUCHERS,
  CURRENCIES,
  // CURRENCY_EXCHANGE,
  // PIN_RECOVERY,
  GATE_SETTINGS,
  // VARIABLES,
  SYSTEM_OPERATIONS,
  // LOCALIZATION,
  PROFILE,
  ...USER_PROFILE,
  IDENTIFICATION,
  WITHDRAWAL,
  TOP_UP,
  BANK_ACCOUNTS,
  // ANOMALY_ANALYSIS,
];

const checkAvailableRoute = (route: IRouteConfig): boolean => {
  if (!route.meta?.root) return false;

  return checkPermission(route.meta?.permission);
};

export const getAvailableDashboardRoutes = (routes: IRouteConfig[] = DASHBOARD_ROUTES): IRouteConfig[] => (
  routes.filter((route: IRouteConfig) => {
    if (route.children) {
      route.children = getAvailableDashboardRoutes(route.children);
    }

    return checkAvailableRoute(route);
  })
);

export const DASHBOARD: IRouteConfig = {
  path: '/dashboard',
  name: 'dashboard',
  component: BaseLayout,
  redirect() {
    const availableRoutes = getAvailableDashboardRoutes();
    const [firstRoute] = availableRoutes;

    return firstRoute || { name: 'sign-in' };
  },
  children: DASHBOARD_ROUTES,
};

export default DASHBOARD_ROUTES;
