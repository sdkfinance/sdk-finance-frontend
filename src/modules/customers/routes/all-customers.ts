import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const AllCustomers: AsyncComponent = () => import(
  /* webpackChunkName: 'all-customers' */ '@/modules/customers/pages/all-customers/index.vue'
);

const CustomersIndividuals: AsyncComponent = () => import(
  /* webpackChunkName: 'customers-individual' */ '@/modules/customers/pages/all-customers/customers-individual.vue'
);

const CustomersMerchant: AsyncComponent = () => import(
  /* webpackChunkName: 'customers-merchant' */ '@/modules/customers/pages/all-customers/customers-merchant.vue'
);

export const ALL_CUSTOMERS_CHILDREN: IRouteConfig[] = [
  {
    path: 'individuals',
    name: 'all-customers-individuals',
    component: CustomersIndividuals,
    meta: {
      root: true,
      translation: 'pages.customers.tabs.individuals',
    },
  },
  {
    path: 'merchants',
    name: 'all-customers-merchants',
    component: CustomersMerchant,
    meta: {
      root: true,
      translation: 'pages.customers.tabs.corporate',
    },
  },
];

export const ALL_CUSTOMERS_ROUTES: IRouteConfig = {
  path: 'all-customers',
  name: 'all-customers',
  component: AllCustomers,
  meta: {
    root: true,
    translation: 'navigation.link.all_customers',
  },
  redirect: ALL_CUSTOMERS_CHILDREN[0],
  children: ALL_CUSTOMERS_CHILDREN,
};
