import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const InternalOperations: AsyncComponent = () => import(
  /* webpackChunkName: 'internal-operations' */
  '@/modules/contracts/pages/internal-operations/index.vue'
);

const InternalOperationsDashboard: AsyncComponent = () => import(
  /* webpackChunkName: 'internal-operations-dashboard' */
  '@/modules/contracts/pages/internal-operations/pages/dashboard.vue'
);

const InternalOperationsOperationList: AsyncComponent = () => import(
  /* webpackChunkName: 'internal-operations-operation-list' */
  '@/modules/contracts/pages/internal-operations/pages/operation-list.vue'
);
const InternalOperationsOperationListEdit: AsyncComponent = () => import(
  /* webpackChunkName: 'internal-operations-operation-list-edit' */
  '@/modules/contracts/pages/internal-operations/pages/edit-operations-list.vue'
);

export const INTERNAL_OPERATIONS_CHILDREN: IRouteConfig[] = [
  {
    path: 'dashboard',
    name: 'internal-operations-dashboard',
    component: InternalOperationsDashboard,
    meta: {
      translation: 'navigation.link.dashboard',
    },
  },
  {
    path: 'operations-list',
    name: 'internal-operations-list',
    component: InternalOperationsOperationList,
    meta: {
      translation: 'navigation.link.internal_operations_list',
      layout: {
        breadcrumbs: {
          parent: 'internal-operations',
        },
      },
    },
  },
];

export const INTERNAL_OPERATIONS: IRouteConfig[] = [
  {
    path: 'internal-operations',
    name: 'internal-operations',
    component: InternalOperations,
    children: INTERNAL_OPERATIONS_CHILDREN,
    redirect: INTERNAL_OPERATIONS_CHILDREN[0],
    meta: {
      root: true,
      translation: 'navigation.link.internal_operations',
      layout: {
        breadcrumbs: {
          parent: 'contracts',
        },
      },
    },
  },
  {
    path: 'internal-operations/operations-list-edit',
    name: 'internal-operations-list-edit',
    component: InternalOperationsOperationListEdit,
    meta: {
      layout: {
        props: {
          backName: 'internal-operations-list',
        },
        breadcrumbs: {
          parent: 'internal-operations-list',
        },
      },
    },
  },
];
