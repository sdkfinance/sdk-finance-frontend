import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

import { ACCOUNT_CHILDREN } from './ACCOUNT_CHILDREN';
import { buildCardPageChildrenRoutes } from './CARD_CHILDREN';
import { TOTAL_BALANCE_CHILDREN } from './TOTAL_BALANCE_CHILDREN';

const BaseLayout = () => import('../../../layouts/base-layout.vue');

const TotalBalancePage: AsyncComponent = () => import('../pages/total-balance/index.vue');

const AccountDetails: AsyncComponent = () => import('../pages/account/index.vue');

const AccountSmartCard: AsyncComponent = () => import('../pages/card/smart-card.vue');

const AccountIssuedCard: AsyncComponent = () => import('../pages/card/issued-card.vue');

export const SMART_CARD_PAGE_CHILDREN = buildCardPageChildrenRoutes('user-dashboard-account-smart-card', 'user-dashboard-account-smart-cards');
export const ISSUED_CARD_PAGE_CHILDREN = buildCardPageChildrenRoutes('user-dashboard-account-card', 'user-dashboard-account-cards');

export const USER_DASHBOARD_CHILDREN: IRouteConfig[] = [
  {
    path: '',
    name: 'user-dashboard-total-balance',
    component: TotalBalancePage,
    meta: {
      layout: {
        componentName: 'UserDashboardLayout',
      },
    },
    children: TOTAL_BALANCE_CHILDREN,
    redirect: TOTAL_BALANCE_CHILDREN[0],
  },
  {
    path: 'account/:serial',
    name: 'user-dashboard-account',
    component: AccountDetails,
    meta: {
      layout: {
        componentName: 'UserDashboardLayout',
        props: {
          isBackVisible: true,
        },
      },
    },
    children: ACCOUNT_CHILDREN,
    redirect: ACCOUNT_CHILDREN[0],
  },
  {
    path: 'account/:serial/cards/:cardId',
    name: 'user-dashboard-account-card',
    component: AccountIssuedCard,
    meta: {
      layout: {
        componentName: 'UserDashboardLayout',
        props: {
          isBackVisible: true,
        },
      },
    },
    children: ISSUED_CARD_PAGE_CHILDREN,
    redirect: ISSUED_CARD_PAGE_CHILDREN[0],
  },
  {
    path: 'account/:serial/smart-cards/:cardId',
    name: 'user-dashboard-account-smart-card',
    component: AccountSmartCard,
    meta: {
      layout: {
        componentName: 'UserDashboardLayout',
        props: {
          isBackVisible: true,
        },
      },
    },
    children: SMART_CARD_PAGE_CHILDREN,
    redirect: SMART_CARD_PAGE_CHILDREN[0],
  },
];

export const USER_DASHBOARD: IRouteConfig = {
  path: '/user-dashboard',
  name: 'user-dashboard',
  component: BaseLayout,
  props: {
    baseLayoutConfig: {
      componentName: 'UserDashboardLayout',
    },
  },
  meta: {
    permission: [ROLES.individual],
  },
  redirect: USER_DASHBOARD_CHILDREN[0],
  children: USER_DASHBOARD_CHILDREN,
};
