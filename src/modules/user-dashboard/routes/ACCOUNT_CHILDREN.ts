import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const SummaryPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-summary' */
  '@/modules/user-dashboard/pages/account/summary/index.vue'
);
const TransactionPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-transactions' */
  '@/modules/user-dashboard/pages/total-balance/transactions/index.vue'
);
const CardsPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-cards' */
  '@/modules/user-dashboard/pages/account/cards/index.vue'
);

const AccountDetailsPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-details' */
  '@/modules/user-dashboard/pages/account/details/index.vue'
);

const SettingsPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-settings' */
  '@/modules/user-dashboard/pages/account/settings/index.vue'
);

export const ACCOUNT_CHILDREN: IRouteConfig[] = [
  {
    path: 'summary',
    name: 'user-dashboard-account-summary',
    meta: {
      translation: 'pages.user_dashboard.links.summary',
      layout: {
        props: {
          isBackVisible: true,
        },
      },
    },
    component: SummaryPage,
  },
  {
    path: 'transactions',
    name: 'user-dashboard-account-transactions',
    meta: {
      translation: 'pages.user_dashboard.links.transactions',
      layout: {
        props: {
          isBackVisible: true,
        },
      },
    },
    component: TransactionPage,
  },
  {
    path: 'cards',
    name: 'user-dashboard-account-cards',
    meta: {
      translation: 'pages.user_dashboard.links.cards',
      layout: {
        props: {
          isBackVisible: true,
        },
      },
    },
    component: CardsPage,
  },
  {
    path: 'details',
    name: 'user-dashboard-account-details',
    meta: {
      translation: 'pages.user_dashboard.links.details',
      layout: {
        props: {
          isBackVisible: true,
        },
      },
    },
    component: AccountDetailsPage,
  },
  {
    path: 'settings',
    name: 'user-dashboard-account-settings',
    meta: {
      translation: 'pages.user_dashboard.links.settings',
      layout: {
        props: {
          isBackVisible: true,
        },
      },
    },
    component: SettingsPage,
  },
];
