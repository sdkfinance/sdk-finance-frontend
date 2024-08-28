import { ENV_VARIABLES } from '@sdk5/shared';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

import BasePageLayout from '../../../layouts/base-page-layout.vue';

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

const TopUpResultSuccessPage = () => import('../top-up-result/success.vue');
const TopUpResultPendingPage = () => import('../top-up-result/pending.vue');
const TopUpResultFailPage = () => import('../top-up-result/fail.vue');

const TokenizationResultSuccessPage = () => import('../tokenization-result/success.vue');
const TokenizationResultPendingPage = () => import('../tokenization-result/pending.vue');
const TokenizationResultFailPage = () => import('../tokenization-result/fail.vue');

const WithdrawalOperationsPage = () => import('../withdrawal-operations.vue');
const WithdrawalViaBankPage = () => import('../withdrawal-via-bank.vue');
const WithdrawalViaDebitCardPage = () => import('../withdrawal-via-debit-card.vue');

const CurrencyRatesPage = () => import('../currency-rates/currency-rates-page.vue');
const GoldRatesPage = () => import('../currency-rates/gold-rates-page.vue');

const CURRENCY_RATES_ROUTES: IRouteConfig[] = [
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
const EXCHANGE_ROUTES: IRouteConfig[] = [
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
];
const MAKE_PAYMENT_OPERATION_ROUTE: IRouteConfig[] = [
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
];
const PAYMENT_TO_CARD_ROUTE: IRouteConfig[] = [
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
];
const PAYMENT_TO_ACCOUNT_ROUTE: IRouteConfig[] = [
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
];
const MOBILE_TOP_UP_ROUTE: IRouteConfig[] = [
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
];
const BANK_TRANSFER_ROUTE: IRouteConfig[] = [
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

export const PAYMENT_OPERATIONS_CHILDREN: IRouteConfig[] = [
  {
    path: 'top-up-result',
    name: 'user-top-up-result',
    component: BasePageLayout,
    meta: {
      disableGuard: true,
      layout: {
        componentName: 'BasePageLayout',
      },
    },
    children: [
      {
        path: 'success',
        meta: {
          disableGuard: true,
          layout: {
            componentName: 'BasePageLayout',
          },
        },
        component: TopUpResultSuccessPage,
      },
      {
        path: 'pending',
        meta: {
          disableGuard: true,
          layout: {
            componentName: 'BasePageLayout',
          },
        },
        component: TopUpResultPendingPage,
      },
      {
        path: 'fail',
        meta: {
          disableGuard: true,
          layout: {
            componentName: 'BasePageLayout',
          },
        },
        component: TopUpResultFailPage,
      },
    ],
  },
  {
    path: 'tokenization-result',
    name: 'user-tokenization-result',
    component: BasePageLayout,
    meta: {
      disableGuard: true,
      layout: {
        componentName: 'BasePageLayout',
      },
    },
    children: [
      {
        path: 'success',
        meta: {
          disableGuard: true,
          layout: {
            componentName: 'BasePageLayout',
          },
        },
        component: TokenizationResultSuccessPage,
      },
      {
        path: 'pending',
        meta: {
          disableGuard: true,
          layout: {
            componentName: 'BasePageLayout',
          },
        },
        component: TokenizationResultPendingPage,
      },
      {
        path: 'fail',
        meta: {
          disableGuard: true,
          layout: {
            componentName: 'BasePageLayout',
          },
        },
        component: TokenizationResultFailPage,
      },
    ],
  },
  ...(ENV_VARIABLES.makePaymentOperationsVisible ? MAKE_PAYMENT_OPERATION_ROUTE : []),
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
    path: 'top-up-payment-card-operations',
    name: 'user-top-up-payment-card-operations',
    component: TopUpPaymentCardOperations,
    meta: {
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
        componentName: 'BasePageLayout',
      },
    },
  },
  ...(ENV_VARIABLES.makePaymentTransferToCardActionVisible ? PAYMENT_TO_CARD_ROUTE : []),
  ...(ENV_VARIABLES.makePaymentTransferToAccountActionVisible ? PAYMENT_TO_ACCOUNT_ROUTE : []),
  ...(ENV_VARIABLES.makePaymentMobileTopUpActionVisible ? MOBILE_TOP_UP_ROUTE : []),
  ...(ENV_VARIABLES.makePaymentOtherPaymentsActionVisible ? BANK_TRANSFER_ROUTE : []),
  ...(ENV_VARIABLES.userDashboardExchangeVisible ? EXCHANGE_ROUTES : []),
  ...(ENV_VARIABLES.userDashboardCurrencyRatesVisible ? CURRENCY_RATES_ROUTES : []),
];

export const PAYMENT_OPERATIONS: IRouteConfig = {
  path: '/payments/',
  name: 'user-payments',
  component: BaseLayout,
  children: PAYMENT_OPERATIONS_CHILDREN,
  redirect: PAYMENT_OPERATIONS_CHILDREN[0],
};
