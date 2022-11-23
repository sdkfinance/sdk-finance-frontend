import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

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
