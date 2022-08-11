import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const Localization: AsyncComponent = () => import(/* webpackChunkName: 'localization' */ '@/modules/localization/pages/localization.vue');

export const LOCALIZATION: IRouteConfig = {
  path: '/dashboard/i18n',
  name: 'localization',
  component: Localization,
  meta: {
    permission: [ROLES.administrator],
    translation: 'navigation.link.localization',
    root: true,
    icon: 'icon-i18n',
  },
};
