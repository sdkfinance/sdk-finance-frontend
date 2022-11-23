import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const Identification: AsyncComponent = () => import(
  /* webpackChunkName: 'identification' */
  '@/modules/identification/pages/identification.vue'
);

export const IDENTIFICATION: IRouteConfig = {
  path: '/dashboard/identification',
  name: 'identification',
  component: Identification,
  meta: {
    permission: [
      ROLES.compliance_manager,
    ],
    translation: 'navigation.link.identification',
    root: true,
    icon: 'icon-identification',
  },
};
