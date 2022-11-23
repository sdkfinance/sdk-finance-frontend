import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const IndividualsCustomers: AsyncComponent = () => import(
  /* webpackChunkName: 'customers-individual' */ '@/modules/customers/pages/all-customers/customers-individual.vue'
);

export const COHORT_ANALYTICS_ROUTES: IRouteConfig = {
  path: 'cohort-analytics',
  name: 'cohort-analytics',
  component: IndividualsCustomers,
  meta: {
    root: true,
    translation: 'navigation.link.cohort_analytics',
  },
};
