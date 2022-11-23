import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const Wallets: AsyncComponent = () => import(/* webpackChunkName: 'wallets' */ '@/modules/wallets/pages/index.vue');

export const WALLETS: IRouteConfig = {
  path: '/dashboard/wallets',
  name: 'Wallets',
  component: Wallets,
  meta: {
    permission: [
      ROLES.merchant,
    ],
    translation: 'navigation.link.wallets',
    root: true,
    icon: 'icon-wallets',
  },
};
