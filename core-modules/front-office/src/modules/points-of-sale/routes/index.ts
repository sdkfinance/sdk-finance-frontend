import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const BasePageLayout: AsyncComponent = () => import('../../../layouts/base-page-layout.vue');
const PointsOfSale: AsyncComponent = () => import('../pages/points-of-sale.vue');
const PointsOfSaleTransactions: AsyncComponent = () => import('../pages/points-of-sale-transactions.vue');

export const POINTS_OF_SALE: IRouteConfig = {
  path: '/dashboard/points-of-sale',
  component: BasePageLayout,
  meta: {
    permission: [ROLES.merchant],
    translation: 'navigation.link.points_of_sale',
    root: true,
    icon: 'icon-points-of-sale',
  },
  children: [
    {
      path: '',
      name: 'points-of-sale',
      component: PointsOfSale,
    },
    {
      path: '/front-office/dashboard/points-of-sale/:id',
      name: 'points-of-sale-transactions',
      component: PointsOfSaleTransactions,
    },
  ],
};
