import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const CurrencyExchange: AsyncComponent = () => import(
  /* webpackChunkName: 'currency_exchange' */ '@/modules/currency-exchange/pages/currency-exchange.vue'
);

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
