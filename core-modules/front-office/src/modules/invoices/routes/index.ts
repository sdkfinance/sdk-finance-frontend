import { ROLES } from '@sdk5/shared/constants';
import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const BasePageLayout: AsyncComponent = () => import('../../../layouts/base-page-layout.vue');
const InvoicesList: AsyncComponent = () => import('../pages/invoices-list.vue');
const InvoicesTemplates: AsyncComponent = () => import('../pages/invoices-templates.vue');

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
      permission: [ROLES.merchant],
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
    permission: [ROLES.merchant],
    translation: 'navigation.link.invoices',
    root: true,
    icon: 'icon-invoices',
  },
};
