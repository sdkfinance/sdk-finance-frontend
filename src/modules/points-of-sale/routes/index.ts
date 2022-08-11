import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const BasePageLayout: AsyncComponent = () => import(/* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue');
const PointsOfSale: AsyncComponent = () => import(/* webpackChunkName: 'points-of-sale' */ '@/modules/points-of-sale/pages/points-of-sale.vue');
const PointsOfSaleTransactions: AsyncComponent = () => (
  import(/* webpackChunkName: 'points-of-sale' */ '@/modules/points-of-sale/pages/points-of-sale-transactions.vue')
);

export const POINTS_OF_SALE: IRouteConfig = {
  path: '/dashboard/points-of-sale',
  component: BasePageLayout,
  meta: {
    permission: [
      ROLES.merchant,
    ],
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
      path: '/dashboard/points-of-sale/:id',
      name: 'points-of-sale-transactions',
      component: PointsOfSaleTransactions,
    },
  ],
};
