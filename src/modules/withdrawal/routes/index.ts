import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const BaseTabsLayout: AsyncComponent = () => import(/* webpackChunkName: 'withdrawal' */
  '@/layouts/base-tabs-layout.vue'
);

const BankWithdrawalRequests: AsyncComponent = () => import(/* webpackChunkName: 'withdrawal' */
  '@/modules/withdrawal/pages/bank-withdrawal-requests/index.vue'
);

export const WITHDRAWAL_CHILDREN: IRouteConfig[] = [
  {
    path: 'bank-withdraw-request',
    name: 'bank-withdraw-request',
    component: BankWithdrawalRequests,
    meta: {
      translation: 'pages.withdrawal.navigation.bank_withdrawal_requests',
    },
  },
];

export const WITHDRAWAL: IRouteConfig = {
  path: '/dashboard/withdrawal',
  component: BaseTabsLayout,
  props: {
    links: WITHDRAWAL_CHILDREN,
    title: 'pages.withdrawal.title',
  },
  meta: {
    permission: [
      ROLES.accountant,
    ],
    translation: 'navigation.link.withdrawal',
    root: true,
    icon: 'icon-withdrawal',
  },
  redirect: WITHDRAWAL_CHILDREN[0],
  children: WITHDRAWAL_CHILDREN,
};
