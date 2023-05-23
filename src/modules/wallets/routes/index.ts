import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const Wallets: AsyncComponent = () => import(/* webpackChunkName: 'wallets' */ '@/modules/wallets/pages/index.vue');

export const WALLETS: IRouteConfig = {
  path: '/dashboard/accounts',
  name: 'Wallets',
  component: Wallets,
  meta: {
    permission: [
      ROLES.merchant,
    ],
    translation: 'navigation.link.accounts',
    root: true,
    icon: 'icon-wallets',
  },
};
