import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const PaymentGateways: AsyncComponent = () => import(
  /* webpackChunkName: 'payment-gateways' */ '@/modules/contracts/pages/payment-gateways/index.vue'
);

const PaymentGatewaysDashboard: AsyncComponent = () => import(
  /* webpackChunkName: 'payment-gateways-dashboard' */ '@/modules/contracts/pages/payment-gateways/payment-gateways-dashboard.vue'
);

const PaymentGatewaysList: AsyncComponent = () => import(
  /* webpackChunkName: 'payment-gateways-list' */ '@/modules/contracts/pages/payment-gateways/payment-gateways-list.vue'
);

export const PAYMENT_GATEWAYS_CHILDREN: IRouteConfig[] = [
  {
    path: 'dashboard',
    name: 'payment-gateways-dashboard',
    component: PaymentGatewaysDashboard,
    meta: {
      root: true,
      translation: 'pages.payment_gateways.tabs.dashboard',
    },
  },
  {
    path: 'list',
    name: 'payment-gateways-list',
    component: PaymentGatewaysList,
    meta: {
      root: true,
      translation: 'pages.payment_gateways.tabs.list',
    },
  },
];

export const PAYMENT_GATEWAYS_ROUTES: IRouteConfig = {
  path: 'payment-gateways',
  name: 'payment-gateways',
  component: PaymentGateways,
  meta: {
    root: true,
    translation: 'navigation.link.payment_gateways',
  },
  children: PAYMENT_GATEWAYS_CHILDREN,
  redirect: PAYMENT_GATEWAYS_CHILDREN[0],
};
