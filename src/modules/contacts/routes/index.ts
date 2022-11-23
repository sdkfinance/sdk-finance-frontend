import { AsyncComponent } from 'vue';

import { IRouteConfig } from '@/types/interfaces';

const BasePageLayout: AsyncComponent = () => import(/* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue');
const ContactsList: AsyncComponent = () => import(/* webpackChunkName: 'contacts' */ '@/modules/contacts/pages/contacts-list.vue');
const UnregisteredContacts: AsyncComponent = () => import(
  /* webpackChunkName: 'unregistered-contacts' */ '@/modules/contacts/pages/unregistered-contacts.vue'
);

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
