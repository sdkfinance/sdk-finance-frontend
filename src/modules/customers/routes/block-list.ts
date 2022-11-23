import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const IndividualsCustomers: AsyncComponent = () => import(
  /* webpackChunkName: 'customers-individual' */ '@/modules/customers/pages/all-customers/customers-individual.vue'
);

export const BLOCK_LIST_ROUTES: IRouteConfig = {
  path: 'block-list',
  name: 'block-list',
  component: IndividualsCustomers,
  meta: {
    root: true,
    translation: 'navigation.link.block_list',
  },
};
