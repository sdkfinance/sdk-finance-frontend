import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const IndividualsCustomers: AsyncComponent = () => import(
  /* webpackChunkName: 'customers-individual' */ '@/modules/customers/pages/all-customers/customers-individual.vue'
);

export const CUSTOMER_ACQUISITION_ROUTES: IRouteConfig = {
  path: 'customer-acquisition',
  name: 'customer-acquisition',
  component: IndividualsCustomers,
  meta: {
    root: true,
    translation: 'navigation.link.customer_acquisition_cost',
  },
};
