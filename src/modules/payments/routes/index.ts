import { AsyncComponent } from 'vue';

import BaseLayout from '@/layouts/base-layout.vue';
import { IRouteConfig } from '@/types/interfaces';

const MakePaymentOperations: AsyncComponent = () => import(
  /* webpackChunkName: 'make-payment-operations' */
  '@/modules/payments/make-payment-operations.vue'
);

const TopUpOperations: AsyncComponent = () => import(
  /* webpackChunkName: 'top-up-operations' */
  '@/modules/payments/top-up-operations.vue'
);

const ExchangeOperations: AsyncComponent = () => import(
  /* webpackChunkName: 'exchange-operations' */
  '@/modules/payments/exchange-operations.vue'
);

const ExchangePage: AsyncComponent = () => import(
  /* webpackChunkName: 'exchange-page' */
  '@/modules/payments/exchange-page.vue'
);

const TopUpCardPage: AsyncComponent = () => import(
  /* webpackChunkName: 'top-up-card-page' */
  '@/modules/payments/top-up-card-page.vue'
);

const TopUpBankPage: AsyncComponent = () => import(
  /* webpackChunkName: 'top-up-bank-page' */
  '@/modules/payments/top-up-bank-page.vue'
);

const PaymentTo: AsyncComponent = () => import(
  /* webpackChunkName: 'payment-to' */
  '@/modules/payments/make-payment/payment-to.vue'
);

const BankTransfer: AsyncComponent = () => import(
  /* webpackChunkName: 'bank-transfer' */
  '@/modules/payments/make-payment/bank-transfer.vue'
);

const MobileTopUp: AsyncComponent = () => import(
  /* webpackChunkName: 'mobile-top-up' */
  '@/modules/payments/make-payment/mobile-top-up.vue'
);

export const PAYMENT_OPERATIONS_CHILDREN: IRouteConfig[] = [
  {
    path: 'make-payment-operations',
    name: 'user-make-payment-operations',
    component: MakePaymentOperations,
    meta: {
      layout: {
        props: {
          backName: 'user-dashboard',
        },
        componentName: 'SimpleLayout',
      },
    },
  },
  {
    path: 'top-up-operations',
    name: 'user-top-up-operations',
    component: TopUpOperations,
    meta: {
      layout: {
        props: {
          backName: 'user-dashboard',
        },
        componentName: 'SimpleLayout',
      },
    },
  },
  {
    path: 'exchange-operations',
    name: 'user-exchange-operations',
    component: ExchangeOperations,
    meta: {
      layout: {
        props: {
          backName: 'user-dashboard',
        },
        componentName: 'SimpleLayout',
      },
    },
  },
  {
    path: 'exchange-sell',
    name: 'user-exchange-sell',
    component: ExchangePage,
    props: {
      isSellOperation: true,
    },
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'exchange-buy',
    name: 'user-exchange-buy',
    component: ExchangePage,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'top-up-card',
    name: 'user-top-up-card',
    component: TopUpCardPage,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'top-up-bank',
    name: 'user-top-up-bank',
    component: TopUpBankPage,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'payment-to-card',
    name: 'user-payment-to-card',
    component: PaymentTo,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'payment-to-account',
    name: 'user-payment-to-account',
    component: PaymentTo,
    props: {
      isAccountPage: true,
    },
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'mobile-top-up',
    name: 'user-mobile-top-up',
    component: MobileTopUp,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'bank-transfer',
    name: 'user-bank-transfer',
    component: BankTransfer,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
];

export const PAYMENT_OPERATIONS: IRouteConfig = {
  path: '/payments/',
  name: 'user-payments',
  component: BaseLayout,
  children: PAYMENT_OPERATIONS_CHILDREN,
  redirect: PAYMENT_OPERATIONS_CHILDREN[0],
};
