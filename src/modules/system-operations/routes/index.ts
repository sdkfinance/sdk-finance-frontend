import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const SystemOperations: AsyncComponent = () => import(
  /* webpackChunkName: 'system-operations' */
  '@/modules/system-operations/pages/system-operations.vue'
);

export const SYSTEM_OPERATIONS: IRouteConfig = {
  path: '/dashboard/system-operations',
  name: 'SystemOperations',
  component: SystemOperations,
  meta: {
    permission: [ROLES.accountant, ROLES.cfo],
    translation: 'navigation.link.system_operations',
    icon: 'icon-system-operations',
    root: true,
  },
};
