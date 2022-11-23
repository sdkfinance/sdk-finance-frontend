import { ROLES } from '@/constants';
import { IRouteConfig } from '@/types/interfaces';

const Users = () => import(/* webpackChunkName: 'users' */ '@/modules/users/pages/users.vue');

export const USERS: IRouteConfig = {
  path: '/dashboard/users',
  name: 'Users',
  component: Users,
  meta: {
    permission: [ROLES.administrator, ROLES.compliance_manager],
    translation: 'navigation.link.users',
    root: true,
    icon: 'icon-users',
  },
};
