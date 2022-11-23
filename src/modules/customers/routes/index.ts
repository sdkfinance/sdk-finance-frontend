import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import BasePageLayout from '@/layouts/base-page-layout.vue';
import { ALL_CUSTOMERS_ROUTES } from '@/modules/customers/routes/all-customers';
import { BLOCK_LIST_ROUTES } from '@/modules/customers/routes/block-list';
import { COHORT_ANALYTICS_ROUTES } from '@/modules/customers/routes/cohort-analytics';
import { CUSTOMER_ACQUISITION_ROUTES } from '@/modules/customers/routes/customer-acquisition';
import { PENDING_USERS_ROUTES } from '@/modules/customers/routes/pending-users';
import { IRouteConfig } from '@/types/interfaces';

const CustomerPageLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'customer-page-layout' */ '@/modules/customers/pages/customer-details/index.vue'
);

export const CUSTOMERS_CHILDREN: IRouteConfig[] = [
  ALL_CUSTOMERS_ROUTES,
  PENDING_USERS_ROUTES,
  BLOCK_LIST_ROUTES,
  COHORT_ANALYTICS_ROUTES,
  CUSTOMER_ACQUISITION_ROUTES,
];

export const CUSTOMERS: IRouteConfig[] = [
  {
    path: '/dashboard/customers',
    name: 'customers',
    component: BasePageLayout,
    meta: {
      permission: [ROLES.administrator],
      translation: 'navigation.link.customers',
      icon: 'icon-smile',
      root: true,
    },
    redirect: CUSTOMERS_CHILDREN[0],
    children: CUSTOMERS_CHILDREN,
  },
  {
    path: '/dashboard/customers/individual/:id',
    name: 'customer-individual-details',
    component: CustomerPageLayout,
    meta: {
      permission: [ROLES.administrator],
      layout: {
        props: {
          backName: 'all-customers-individuals',
        },
        breadcrumbs: {
          parent: 'all-customers-individuals',
        },
      },
    },
  },
  {
    path: '/dashboard/customers/merchants/:id',
    name: 'customer-merchants-details',
    component: CustomerPageLayout,
    meta: {
      permission: [ROLES.administrator],
      layout: {
        props: {
          backName: 'all-customers-merchants',
        },
        breadcrumbs: {
          parent: 'all-customers-merchants',
        },
      },
    },
  },

];
