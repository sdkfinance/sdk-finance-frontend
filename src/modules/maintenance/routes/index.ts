import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const Maintenance: AsyncComponent = () => import(
  /* webpackChunkName: 'maintenance' */
  '@/modules/maintenance/pages/maintenance.vue'
);

export const MAINTENANCE: IRouteConfig = {
  path: '/maintenance',
  name: 'maintenance',
  component: Maintenance,
  meta: {
    permission: [],
    root: false,
  },
};
