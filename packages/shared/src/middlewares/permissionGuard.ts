import { useDashboardNameByRole } from '../composables/useDashboardNameByRole';
import { UserProfileInstance } from '../services/UserProfileService';
import { UserInstance } from '../services/UserService';
import type { RouteMiddleware } from '../types';

type TPermission = Function | Array<string> | undefined;
const { getDashboardName } = useDashboardNameByRole();
const roleCheck = (permission: TPermission, userRole: string | undefined): boolean => {
  if (typeof permission === 'function') {
    return !!permission(userRole);
  }

  if (!userRole) {
    return true;
  }

  return !permission || permission.length === 0 || permission.includes(userRole);
};

export const checkUserProfilePermission = (permission: TPermission): boolean => roleCheck(permission, UserProfileInstance.role);

export const checkPermission = (permission: TPermission): boolean => roleCheck(permission, UserInstance.role);

export const permissionGuard: RouteMiddleware = ({ to, next, abort }) => {
  const { permission: rootPermission } = to?.matched.find((r) => r.meta?.permission)?.meta || {};
  const { permission, userProfilePermission } = to?.meta || {};

  if (checkPermission(permission || rootPermission) && checkUserProfilePermission(userProfilePermission)) {
    return next();
  }

  return abort({
    name: getDashboardName(UserInstance.role) || 'entrance',
    query: to.query,
  });
};
