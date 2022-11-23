import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const Transfers: AsyncComponent = () => import(/* webpackChunkName: 'transfers' */ '@/modules/transfers/pages/transfers.vue');

export const TRANSFERS: IRouteConfig = {
  path: '/dashboard/transfers',
  name: 'transfers',
  component: Transfers,
  meta: {
    permission: [
      ROLES.administrator,
      ROLES.merchant,
      ROLES.compliance_manager,
      ROLES.compliance_specialist,
      ROLES.cashier,
      ROLES.accountant,
      ROLES.antifraud_specialist,
      ROLES.customer_support,
    ],
    translation: 'navigation.link.transfers',
    root: true,
    icon: 'icon-transfers',
  },
};
