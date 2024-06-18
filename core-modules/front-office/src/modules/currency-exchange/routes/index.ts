import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const CurrencyExchange: AsyncComponent = () => import('../pages/currency-exchange.vue');

export const CURRENCY_EXCHANGE: IRouteConfig = {
  path: '/dashboard/currency-exchange',
  name: 'CurrencyExchange',
  component: CurrencyExchange,
  meta: {
    permission: [ROLES.merchant],
    translation: 'navigation.link.exchange_rates',
    icon: 'icon-currency',
    root: true,
  },
};
