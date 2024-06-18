export const UPDATE_USER_PARAM_TYPE = {
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN',
} as const;

export const UPDATE_USER_REASON = {
  AML: 'AML',
  FRAUD: 'FRAUD',
  OTHER: 'OTHER',
} as const;

export type TUpdateUserParamType = (typeof UPDATE_USER_PARAM_TYPE)[keyof typeof UPDATE_USER_PARAM_TYPE];
export type TUpdateUserReason = (typeof UPDATE_USER_REASON)[keyof typeof UPDATE_USER_REASON];
