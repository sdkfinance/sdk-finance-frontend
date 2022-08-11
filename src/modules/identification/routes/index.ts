import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

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
