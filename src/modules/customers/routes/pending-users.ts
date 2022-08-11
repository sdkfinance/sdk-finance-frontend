import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const IndividualsCustomers: AsyncComponent = () => import(
  /* webpackChunkName: 'customers-individual' */ '@/modules/customers/pages/all-customers/customers-individual.vue'
);

export const PENDING_USERS_ROUTES: IRouteConfig = {
  path: 'pending-users',
  name: 'pending-users',
  component: IndividualsCustomers,
  meta: {
    root: true,
    translation: 'navigation.link.pending_users',
  },
};
