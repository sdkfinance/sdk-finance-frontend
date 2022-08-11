import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';

const Profile: AsyncComponent = () => import(/* webpackChunkName: 'profile' */
  '@/modules/profile-settings/pages/profile.vue'
);

const ProfileNotifications: AsyncComponent = () => import(/* webpackChunkName: 'profile-and-notifications' */
  '@/modules/profile-settings/pages/profile-and-notifications/index.vue'
);

const ProfilePassword: AsyncComponent = () => import(/* webpackChunkName: 'profile-password' */
  '@/modules/profile-settings/pages/profile-password/index.vue'
);

export const PROFILE_CHILDREN: IRouteConfig[] = [
  {
    path: 'notifications',
    name: 'profile',
    component: ProfileNotifications,
    meta: {
      translation: 'pages.profile.navigation.profile_and_notification',
    },
  },
  {
    path: 'password',
    name: 'profile-password',
    component: ProfilePassword,
    meta: {
      translation: 'pages.profile.navigation.password',
    },
  },
];

export const PROFILE: IRouteConfig = {
  path: '/profile',
  component: Profile,
  meta: {
    permission: [],
    root: false,
  },
  children: PROFILE_CHILDREN,
};
