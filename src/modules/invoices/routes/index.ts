import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const BasePageLayout: AsyncComponent = () => import(/* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue');
const InvoicesList: AsyncComponent = () => import(/* webpackChunkName: 'invoices' */ '@/modules/invoices/pages/invoices-list.vue');
const InvoicesTemplates: AsyncComponent = () => import(
  /* webpackChunkName: 'invoices-templates' */ '@/modules/invoices/pages/invoices-templates.vue'
);

export const INVOICES_CHILDREN: IRouteConfig[] = [
  {
    path: 'list',
    name: 'invoices-list',
    component: InvoicesList,
    meta: {
      translation: 'pages.invoices.invoices_list',
    },
  },
  {
    path: 'templates',
    name: 'invoices-templates',
    component: InvoicesTemplates,
    meta: {
      translation: 'pages.invoices.invoices_templates',
      permission: [
        ROLES.merchant,
      ],
    },
  },
];

export const INVOICES: IRouteConfig = {
  path: '/dashboard/invoices',
  name: 'invoices',
  component: BasePageLayout,
  redirect: INVOICES_CHILDREN[0],
  children: INVOICES_CHILDREN,
  meta: {
    permission: [
      ROLES.merchant,
    ],
    translation: 'navigation.link.invoices',
    root: true,
    icon: 'icon-invoices',
  },
};
