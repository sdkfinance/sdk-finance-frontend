import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import BaseLayout from '@/layouts/base-layout.vue';
import { ACCOUNT_CHILDREN } from '@/modules/user-dashboard/routes/ACCOUNT_CHILDREN';
import { TOTAL_BALANCE_CHILDREN } from '@/modules/user-dashboard/routes/TOTAL_BALANCE_CHILDREN';
import { CARD_CHILDREN } from '@/modules/user-dashboard/routes/CARD_CHILDREN';
import { ROLES } from '@/constants';

const TotalBalancePage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-main' */
  '@/modules/user-dashboard/pages/total-balance/index.vue'
);

const AccountDetails: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account' */
  '@/modules/user-dashboard/pages/account/index.vue'
);

const AccountCard: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-card' */
  '@/modules/user-dashboard/pages/card/index.vue'
);

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
    component: AccountCard,
    meta: {
      layout: {
        componentName: 'UserDashboardLayout',
        props: {
          isBackVisible: true,
        },
      },
    },
    children: CARD_CHILDREN,
    redirect: CARD_CHILDREN[0],
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
