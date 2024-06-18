import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';

const MyAccountsAndBalancesPageLayout = () => import('../layouts/accounts-and-balances-layout.vue');
const AccountsPage = () => import('../pages/accounts-page.vue');
const TemplatesPage = () => import('../pages/templates-page.vue');
const SubscriptionsPage = () => import('../pages/subscriptions-page.vue');

export const MY_ACCOUNTS_AND_BALANCES_CHILDREN: IRouteConfig[] = [
  {
    path: 'accounts',
    name: 'my-accounts',

    component: AccountsPage,
    meta: {
      translation: 'navigation.link.accounts',
    },
  },
  {
    path: 'templates',
    name: 'templates',
    component: TemplatesPage,
    meta: {
      translation: 'navigation.link.templates',
    },
  },
  {
    path: 'subscriptions',
    name: 'subscriptions',
    component: SubscriptionsPage,
    meta: {
      translation: 'navigation.link.subscriptions',
    },
  },
];

export const MY_ACCOUNTS_AND_BALANCES: IRouteConfig = {
  path: '/dashboard/my-accounts-and-balances',
  name: 'my-accounts-and-balances',
  component: MyAccountsAndBalancesPageLayout,
  meta: {
    permission: [ROLES.merchant],
    translation: 'navigation.link.accounts',
    root: true,
    icon: 'icon-wallets',
  },
  props: {
    title: 'navigation.link.my_accounts_and_balances',
    tabs: MY_ACCOUNTS_AND_BALANCES_CHILDREN,
  },
  redirect: MY_ACCOUNTS_AND_BALANCES_CHILDREN[0],
  children: MY_ACCOUNTS_AND_BALANCES_CHILDREN,
};
