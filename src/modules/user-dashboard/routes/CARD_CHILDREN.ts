import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const TransactionPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-transactions' */
  '@/modules/user-dashboard/pages/total-balance/transactions/index.vue'
);

const DetailsPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-card-details' */
  '@/modules/user-dashboard/pages/card/details/index.vue'
);
const SettingsPage: AsyncComponent = () => import(
  /* webpackChunkName: 'user-dashboard-account-card-settings' */
  '@/modules/user-dashboard/pages/card/settings/index.vue'
);

export const CARD_CHILDREN: IRouteConfig[] = [
  {
    path: 'transactions',
    name: 'user-dashboard-account-card-transactions',
    meta: {
      translation: 'pages.user_dashboard.links.transactions',
      layout: {
        props: {
          isBackVisible: true,
          backName: 'user-dashboard-account-cards',
        },
      },
    },
    component: TransactionPage,
  },
  {
    path: 'settings',
    name: 'user-dashboard-account-card-settings',
    meta: {
      translation: 'pages.user_dashboard.links.settings',
      layout: {
        props: {
          isBackVisible: true,
          backName: 'user-dashboard-account-cards',
        },
      },
    },
    component: SettingsPage,
  },
  {
    path: 'details',
    name: 'user-dashboard-account-card-details',
    meta: {
      translation: 'pages.user_dashboard.links.card_details',
      layout: {
        props: {
          isBackVisible: true,
          backName: 'user-dashboard-account-cards',
        },
      },
    },
    component: DetailsPage,
  },
];
