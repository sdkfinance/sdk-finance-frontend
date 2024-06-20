import type { TFrontOfficeRole, TRole } from '../constants';
import { ENV_VARIABLES } from '../constants';
import { DASHBOARD_NAMES, FRONT_OFFICE_DASHBOARD_NAMES } from '../constants';
import { ROLES } from '../constants';

export const useDashboardNameByRole = () => {
  const FRONT_OFFICE_ROLES = [ROLES.individual, ROLES.merchant] satisfies TFrontOfficeRole[];

  const checkIsFrontOfficeRole = (role: TRole): role is TFrontOfficeRole => FRONT_OFFICE_ROLES.indexOf(role as TFrontOfficeRole) >= 0;

  const getDashboardName = (roleName: TRole): string | null => {
    if (ENV_VARIABLES.availableRole && roleName.toLowerCase() !== ENV_VARIABLES.availableRole) {
      return null;
    }

    const isFrontOfficeRole = checkIsFrontOfficeRole(roleName);

    if (isFrontOfficeRole) {
      if (!ENV_VARIABLES.frontOfficeRoutesVisible) {
        return null;
      }

      return FRONT_OFFICE_DASHBOARD_NAMES[roleName] || null;
    }

    if (!ENV_VARIABLES.backOfficeRoutesVisible) {
      return null;
    }

    return DASHBOARD_NAMES.DEFAULT;
  };

  return {
    getDashboardName,
  };
};
