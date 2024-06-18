import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const BaseLayout = () => import('../../../layouts/base-layout.vue');

const MakePaymentOperations: AsyncComponent = () => import('../make-payment-operations.vue');

const TopUpOperations: AsyncComponent = () => import('../top-up-operations.vue');

const ExchangeOperations: AsyncComponent = () => import('../exchange-operations.vue');

const ExchangePage: AsyncComponent = () => import('../exchange-page.vue');

const TopUpCardPage: AsyncComponent = () => import('../top-up-card-page.vue');

const TopUpBankPage: AsyncComponent = () => import('../top-up-bank-page.vue');

const PaymentTo: AsyncComponent = () => import('../make-payment/payment-to.vue');

const BankTransfer: AsyncComponent = () => import('../make-payment/bank-transfer.vue');

const MobileTopUp: AsyncComponent = () => import('../make-payment/mobile-top-up.vue');

const TopUpPaymentCardOperations: AsyncComponent = () => import('../top-up-payment-card-operations.vue');

const TopUpCorefyPage = () => import('../top-up-corefy-page.vue');

const TopUpResultPage = () => import('../top-up-result.vue');

const WithdrawalOperationsPage = () => import('../withdrawal-operations.vue');
const WithdrawalViaBankPage = () => import('../withdrawal-via-bank.vue');
const WithdrawalViaDebitCardPage = () => import('../withdrawal-via-debit-card.vue');
const WithdrawalCorefyPage = () => import('../withdrawal-corefy-page.vue');

const CurrencyRatesPage = () => import('../currency-rates/currency-rates-page.vue');
const GoldRatesPage = () => import('../currency-rates/gold-rates-page.vue');

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
  {
    path: 'top-up-payment-card-operations',
    name: 'user-top-up-payment-card-operations',
    component: TopUpPaymentCardOperations,
    meta: {
      layout: {
        props: {
          backName: 'user-top-up-operations',
        },
        componentName: 'SimpleLayout',
      },
    },
  },
  {
    path: 'top-up-corefy',
    name: 'user-corefy-top-up',
    component: TopUpCorefyPage,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'top-up-result',
    name: 'user-top-up-result',
    component: TopUpResultPage,
    meta: {
      disableGuard: true,
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'withdrawal-operations',
    name: 'user-withdrawal-operations',
    component: WithdrawalOperationsPage,
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
    path: 'withdrawal-bank',
    name: 'user-withdrawal-via-bank',
    component: WithdrawalViaBankPage,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'withdrawal-debit-card',
    name: 'user-withdrawal-via-debit-card',
    component: WithdrawalViaDebitCardPage,
    meta: {
      layout: {
        props: {
          backName: 'user-withdrawal-operations',
        },
        componentName: 'SimpleLayout',
      },
    },
  },
  {
    path: 'withdrawal-corefy',
    name: 'user-withdrawal-via-corefy',
    component: WithdrawalCorefyPage,
    meta: {
      layout: {
        componentName: 'BasePageLayout',
      },
    },
  },
  {
    path: 'currency-rates',
    name: 'user-currency-rates',
    component: CurrencyRatesPage,
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
    path: 'gold-rates',
    name: 'user-gold-rates',
    component: GoldRatesPage,
    meta: {
      layout: {
        props: {
          backName: 'user-currency-rates',
        },
        componentName: 'SimpleLayout',
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
