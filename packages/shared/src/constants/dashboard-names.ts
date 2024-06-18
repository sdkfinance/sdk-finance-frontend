import { ROLES } from './roles';

export const FRONT_OFFICE_DASHBOARD_NAMES = {
  [ROLES.individual]: 'user-dashboard',
  [ROLES.merchant]: 'front-office-dashboard',
} as const;

export const DASHBOARD_NAMES = {
  ...FRONT_OFFICE_DASHBOARD_NAMES,
  DEFAULT: 'dashboard',
} as const;
