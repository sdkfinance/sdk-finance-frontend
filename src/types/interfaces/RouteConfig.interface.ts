// eslint-disable-next-line import/no-unresolved
import { RouteConfigMultipleViews, RouteConfigSingleView } from 'vue-router/types/router';
import { LocaleMessage } from 'vue-i18n';
import { TRole } from '@/constants/roles';
import { IPlainObject } from '@/types/interfaces/PlainObject.interface';
// It's temporary solution, next relies vue router add generic type for type meta data;
// https://github.com/vuejs/vue-router/pull/3218

export interface RouteMetaConfigSingleView extends RouteConfigSingleView {
  meta?: IMetaConfig;
  children?: IRouteConfig[];
}

export interface RouteMetaConfigMultipleViews extends RouteConfigMultipleViews {
  meta?: IMetaConfig;
  children?: IRouteConfig[];
}

export interface TRouteLayoutProps extends IPlainObject {
  backName?: string;
}

export type TPermissionFn = (role: TRole) => boolean;

export type TCheckFn = () => boolean;

export type TRouteLayout = {
  componentName?: string;
  props?: TRouteLayoutProps;
  breadcrumbs?: {
    parent: string;
  };
}
export type TRouteBadge = {
  status: string;
  label?: string;
}

export interface IMetaConfig {
  permission?: TRole[] | TPermissionFn; /**
  who can see page
  not use = undefined = all roles,
  array = array of ROLES = only includes roles,
  function = custom checker return boolean type for this user role
  */
  userProfilePermission?: TRole[] | TPermissionFn; /**
   who can see page
   not use = undefined = all roles,
   array = array of ROLES = only includes roles,
   function = custom checker return boolean type for this user role
   */
  translation?: string | LocaleMessage; // label text for dashboard menu
  icon?: string; // icon for dashboard menu
  root?: boolean;
  disableGuard?: boolean; // disable default guard(check auth)
  middleware?: any[];
  isHide?: boolean;
  level?: number; // nested level
  check?: TCheckFn;
  badge?: TRouteBadge;
  layout?: TRouteLayout;
}

export type IRouteConfig = RouteMetaConfigSingleView | RouteMetaConfigMultipleViews;
