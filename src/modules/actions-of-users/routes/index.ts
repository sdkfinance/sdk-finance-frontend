import { AsyncComponent } from 'vue';

import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const ActionsOfUsers: AsyncComponent = () => import(/* webpackChunkName: 'actions-of-users' */
  '@/modules/actions-of-users/pages/actions-of-users.vue'
);

export const ACTIONS_OF_USERS: IRouteConfig = {
  path: '/dashboard/actions-of-users',
  name: 'actions-of-users',
  component: ActionsOfUsers,
  meta: {
    permission: [ROLES.administrator],
    translation: 'navigation.link.actions_of_users',
    root: true,
    icon: 'icon-actions-of-users',
  },
};
