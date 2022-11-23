import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const Vouchers: AsyncComponent = () => import(/* webpackChunkName: 'vouchers' */ '@/modules/vouchers/pages/vouchers.vue');

export const VOUCHERS: IRouteConfig = {
  path: '/dashboard/vouchers',
  name: 'vouchers',
  component: Vouchers,
  meta: {
    permission: [
      ROLES.merchant,
    ],
    translation: 'navigation.link.vouchers',
    root: true,
    icon: 'icon-voucher',
  },
};
