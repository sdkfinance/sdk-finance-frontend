import type { IRouteConfig } from '@sdk5/shared/types';
import type { AsyncComponent } from 'vue';

const Profile: AsyncComponent = () => import('../pages/profile.vue');

const ProfileNotifications: AsyncComponent = () => import('../pages/profile-and-notifications/index.vue');

const ProfilePassword: AsyncComponent = () => import('../pages/profile-password/index.vue');

export const PROFILE_CHILDREN: IRouteConfig[] = [
  {
    path: 'notifications',
    name: 'front-office-profile',
    component: ProfileNotifications,
    meta: {
      translation: 'pages.profile.navigation.profile_and_notification',
    },
  },
  {
    path: 'password',
    name: 'front-office-profile-password',
    component: ProfilePassword,
    meta: {
      translation: 'pages.profile.navigation.password',
    },
  },
];

export const PROFILE: IRouteConfig = {
  path: '/profile/',
  component: Profile,
  meta: {
    permission: [],
    root: false,
  },
  redirect: PROFILE_CHILDREN[0],
  children: PROFILE_CHILDREN,
};
