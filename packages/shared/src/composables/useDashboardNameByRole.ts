import type { TFrontOfficeRole, TRole } from '../constants';
import { DASHBOARD_NAMES, FRONT_OFFICE_DASHBOARD_NAMES } from '../constants';
import { ROLES } from '../constants';

export const useDashboardNameByRole = () => {
  const FRONT_OFFICE_ROLES = [ROLES.individual, ROLES.merchant] satisfies TFrontOfficeRole[];

  const frontOfficeRotesExists = import.meta.env.VUE_APP_FRONT_OFFICE_ROUTES !== 'false';
  const backOfficeRotesExists = import.meta.env.VUE_APP_BACK_OFFICE_ROUTES !== 'false';

  const checkIsFrontOfficeRole = (role: TRole): role is TFrontOfficeRole => FRONT_OFFICE_ROLES.indexOf(role as TFrontOfficeRole) >= 0;

  const getDashboardName = (roleName: TRole): string | null => {
    const isFrontOfficeRole = checkIsFrontOfficeRole(roleName);

    if (isFrontOfficeRole) {
      if (!frontOfficeRotesExists) {
        return null;
      }

      return FRONT_OFFICE_DASHBOARD_NAMES[roleName] || null;
    }

    if (!backOfficeRotesExists) {
      return null;
    }

    return DASHBOARD_NAMES.DEFAULT;
  };

  return {
    getDashboardName,
  };
};
