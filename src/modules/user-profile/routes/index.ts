import { AsyncComponent } from 'vue';
import { Route } from 'vue-router';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const UserProfile: AsyncComponent = () => import(/* webpackChunkName: 'user-profile' */
  '@/modules/user-profile/pages/user-profile.vue'
);

const UserProfileAndBusiness: AsyncComponent = () => import(/* webpackChunkName: 'user-profile-and-business' */
  '@/modules/user-profile/pages/user-profile-and-business/index.vue'
);

const UserProfileKYC: AsyncComponent = () => import(/* webpackChunkName: 'user-profile-kyc' */
  '@/modules/user-profile/pages/user-profile-kyc/index.vue'
);

const UserLoginAndSecurity: AsyncComponent = () => import(/* webpackChunkName: 'user-profile-login-and-security' */
  '@/modules/user-profile/pages/user-login-and-security/index.vue'
);

const UserWallets: AsyncComponent = () => import(/* webpackChunkName: 'user-profile-wallet' */
  '@/modules/user-profile/pages/user-profile-wallets/index.vue'
);

const UserTransactions: AsyncComponent = () => import(/* webpackChunkName: 'user-profile-transactions' */
  '@/modules/transactions-old/pages/transactions.vue'
);

const UserActionsOfUsers: AsyncComponent = () => import(/* webpackChunkName: 'user-profile-actions-of-users' */
  '@/modules/actions-of-users/pages/actions-of-users.vue'
);

export const USER_PROFILE_CHILDREN = [
  {
    path: 'profile',
    name: 'user-profile-and-business',
    component: UserProfileAndBusiness,
    meta: {
      translation: 'pages.user_profile.navigation.profile_and_business',
      layout: {
        props: {
          backName: 'Users',
        },
      },
    },
  },
  {
    path: 'kyc',
    name: 'user-profile-kyc',
    component: UserProfileKYC,
    meta: {
      translation: 'pages.user_profile.navigation.kyc',
      layout: {
        props: {
          backName: 'kyc',
        },
      },
    },
  },
  {
    path: 'login-and-security',
    name: 'user-profile-security',
    component: UserLoginAndSecurity,
    meta: {
      translation: 'pages.user_profile.navigation.login_and_security',
      layout: {
        props: {
          backName: 'Users',
        },
      },
    },
  },
  {
    path: 'wallets',
    name: 'user-profile-wallets',
    component: UserWallets,
    meta: {
      translation: 'pages.user_profile.navigation.wallets',
      layout: {
        props: {
          backName: 'Users',
        },
      },
    },
  },
  {
    path: 'transactions',
    name: 'user-profile-transactions',
    component: UserTransactions,
    props: (route: Route) => ({
      defaultFilter: { orgIds: [route.params.organizationId] },
      isTitleVisible: false,
      isFullPage: false,
    }),
    meta: {
      translation: 'pages.user_profile.navigation.transactions',
      layout: {
        props: {
          backName: 'Users',
        },
      },
    },
  },
  {
    path: 'actions-of-user',
    name: 'user-profile-actions-of-user',
    component: UserActionsOfUsers,
    props: (route: Route) => ({
      defaultFilter: { userIds: [route.params.organizationId] },
      isTitleVisible: false,
      isFullPage: false,
    }),
    meta: {
      translation: 'pages.user_profile.navigation.actions_of_user',
      layout: {
        props: {
          backName: 'Users',
        },
      },
    },
  },
];

export const USER_PROFILE: IRouteConfig[] = [
  {
    path: '/dashboard/users/:id',
    meta: {
      permission: [ROLES.administrator],
      root: false,
    },
  },
  {
    path: '/dashboard/users/:id/:organizationId',
    component: UserProfile,
    name: 'users-profile',
    meta: {
      permission: [ROLES.administrator],
      root: false,
    },
    redirect: USER_PROFILE_CHILDREN[0],
    children: USER_PROFILE_CHILDREN,
  },
];
