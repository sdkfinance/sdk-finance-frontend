import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const TransactionPage: AsyncComponent = () => import('../pages/total-balance/transactions/index.vue');

const DetailsPage: AsyncComponent = () => import('../pages/card/details/index.vue');
const SettingsPage: AsyncComponent = () => import('../pages/card/settings/index.vue');

export function buildCardPageChildrenRoutes(namePrefix: string, backName: string): IRouteConfig[] {
  return [
    {
      path: 'transactions',
      name: `${namePrefix}-transactions`,
      meta: {
        translation: 'pages.user_dashboard.links.transactions',
        layout: {
          props: {
            isBackVisible: true,
            backName,
          },
        },
      },
      component: TransactionPage,
    },
    {
      path: 'settings',
      name: `${namePrefix}-settings`,
      meta: {
        translation: 'pages.user_dashboard.links.settings',
        layout: {
          props: {
            isBackVisible: true,
            backName,
          },
        },
      },
      component: SettingsPage,
    },
    {
      path: 'details',
      name: `${namePrefix}-details`,
      meta: {
        translation: 'pages.user_dashboard.links.card_details',
        layout: {
          props: {
            isBackVisible: true,
            backName,
          },
        },
      },
      component: DetailsPage,
    },
  ];
}
