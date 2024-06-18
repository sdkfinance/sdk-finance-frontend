import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const Vouchers: AsyncComponent = () => import('../pages/vouchers.vue');

export const VOUCHERS: IRouteConfig = {
  path: '/dashboard/vouchers',
  name: 'vouchers',
  component: Vouchers,
  meta: {
    permission: [ROLES.merchant],
    translation: 'navigation.link.vouchers',
    root: true,
    icon: 'icon-voucher',
  },
};
