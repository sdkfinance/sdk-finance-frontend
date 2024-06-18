import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const SummaryPage: AsyncComponent = () => import('../pages/account/summary/index.vue');
const TransactionPage: AsyncComponent = () => import('../pages/total-balance/transactions/index.vue');
const SmartCardsPage: AsyncComponent = () => import('../pages/account/cards/smart-cards.vue');
const CardsPage: AsyncComponent = () => import('../pages/account/cards/cards.vue');

const AccountDetailsPage: AsyncComponent = () => import('../pages/account/details/index.vue');

const SettingsPage: AsyncComponent = () => import('../pages/account/settings/index.vue');

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
    path: 'smart-cards',
    name: 'user-dashboard-account-smart-cards',
    meta: {
      translation: 'pages.user_dashboard.links.smart_cards',
      layout: {
        props: {
          isBackVisible: true,
        },
      },
    },
    component: SmartCardsPage,
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
      translation: 'pages.user_dashboard.links.bank_accounts',
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
