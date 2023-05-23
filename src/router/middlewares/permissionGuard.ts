import { DASHBOARD_NAMES } from '@/router';
import { routeMiddleware } from '@/router/middlewares/types/routeMiddleware';
import { UserProfileInstance } from '@/services/UserProfileService';
import { UserInstance } from '@/services/UserService';

type TPermission = Function | Array<string> | undefined;

const roleCheck = (permission: TPermission, userRole: string | undefined): boolean => {

  if (typeof permission === 'function') {
    return !!permission(userRole);
  }

  if (!userRole) {
    return true;
  }

  return !permission || permission.length === 0 || permission.includes(userRole);
};

export const checkUserProfilePermission = (permission: TPermission): boolean => (
  roleCheck(permission, UserProfileInstance.role)
);

export const checkPermission = (permission: TPermission): boolean => roleCheck(permission, UserInstance.role);

export const permissionGuard: routeMiddleware = ({ to, next, abort }) => {
  const { permission: rootPermission } = to?.matched.find((r) => r.meta?.permission)?.meta || {};
  const { permission, userProfilePermission } = to?.meta || {};

  if (checkPermission(permission || rootPermission) && checkUserProfilePermission(userProfilePermission)) {
    return next();
  }

  return abort({
    name: DASHBOARD_NAMES[UserInstance.role] || DASHBOARD_NAMES.DEFAULT,
    query: to.query,
  });
};
