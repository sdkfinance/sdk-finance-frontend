import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const GateSettings: AsyncComponent = () => import(/* webpackChunkName: 'gate-settings' */ '@/modules/gate-settings/pages/gate-settings.vue');
const AccountSettings: AsyncComponent = () => import(/* webpackChunkName: 'gate-settings' */ '@/modules/gate-settings/pages/account-settings.vue');
const BasePageLayout: AsyncComponent = () => import(/* webpackChunkName: 'base-page-layout' */ '@/layouts/base-page-layout.vue');

export const GATE_SETTINGS: IRouteConfig = {
  path: '/dashboard/gate-settings',
  name: 'gate-settings',
  component: BasePageLayout,
  redirect: { name: 'gate-settings-main' },
  meta: {
    permission: [
      ROLES.administrator,
      ROLES.cfo,
    ],
    translation: 'navigation.link.gate_settings',
    root: true,
    icon: 'icon-settings',
  },
  children: [
    {
      path: '',
      name: 'gate-settings-main',
      component: GateSettings,
    },
    {
      path: 'gate-settings/:id',
      name: 'gate-account-settings',
      component: AccountSettings,
      meta: {
        layout: {
          props: {
            backName: 'gate-settings-main',
          },
        },
      },
    },
  ],
};
