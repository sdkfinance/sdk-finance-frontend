import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const KYCPage: AsyncComponent = () => import(
  /* webpackChunkName: 'kyc' */
  '@/modules/kyc/pages/index.vue'
);

export const KYC: IRouteConfig = {
  path: '/dashboard/kyc',
  name: 'kyc',
  component: KYCPage,
  meta: {
    permission: [
      ROLES.administrator,
    ],
    translation: 'navigation.link.kyc_pending_customers',
    root: true,
    icon: 'icon-user-waiting',
  },
};
