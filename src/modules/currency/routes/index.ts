import { AsyncComponent } from 'vue';
import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const BasePageLayout: AsyncComponent = () => import(
  /* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue'
);
const Currency: AsyncComponent = () => import(/* webpackChunkName: 'currency' */ '@/modules/currency/pages/currency.vue');
const Issuers: AsyncComponent = () => import(/* webpackChunkName: 'issuers' */ '@/modules/currency/pages/issuers.vue');

export const CURRENCIES_CHILDREN: IRouteConfig[] = [
  {
    path: 'list',
    name: 'currencies',
    component: Currency,
    meta: {
      permission: [ROLES.administrator],
      translation: 'navigation.link.currencies',

    },
  },
  {
    path: 'issuers-list',
    name: 'issuers',
    component: Issuers,
    meta: {
      permission: [ROLES.administrator],
      translation: 'navigation.link.issuers',
    },
  },
];

export const CURRENCIES: IRouteConfig = {
  path: '/dashboard/currencies',
  component: BasePageLayout,
  children: CURRENCIES_CHILDREN,
  redirect: CURRENCIES_CHILDREN[0],
  meta: {
    permission: [ROLES.administrator],
    translation: 'navigation.link.currencies',
    icon: 'icon-currency',
    root: true,
  },
};
