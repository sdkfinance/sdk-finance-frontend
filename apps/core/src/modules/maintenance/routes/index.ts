import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const Maintenance: AsyncComponent = () => import('@/modules/maintenance/pages/maintenance.vue');

export const MAINTENANCE: IRouteConfig = {
  path: '/maintenance',
  name: 'maintenance',
  component: Maintenance,
  meta: {
    permission: [],
    root: false,
  },
};
