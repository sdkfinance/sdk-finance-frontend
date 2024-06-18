import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const BasePageLayout: AsyncComponent = () => import('../../../layouts/base-page-layout.vue');
const ContactsList: AsyncComponent = () => import('../pages/contacts-list.vue');
const UnregisteredContacts: AsyncComponent = () => import('../pages/unregistered-contacts.vue');

export const CONTACTS_CHILDREN: IRouteConfig[] = [
  {
    path: 'contacts-list',
    name: 'contacts-list',
    component: ContactsList,
    meta: {
      translation: 'pages.contacts.contacts_list',
    },
  },
  {
    path: 'unregistered',
    name: 'unregistered-contacts',
    component: UnregisteredContacts,
    meta: {
      translation: 'pages.contacts.unregistered_contacts',
    },
  },
];

export const CONTACTS: IRouteConfig = {
  path: '/dashboard/contacts',
  name: 'contacts',
  component: BasePageLayout,
  redirect: CONTACTS_CHILDREN[0],
  children: CONTACTS_CHILDREN,
  meta: {
    permission: () => false, // Only for individual, now not uses
    translation: 'navigation.link.contacts',
    root: true,
    icon: 'icon-contacts',
  },
};
