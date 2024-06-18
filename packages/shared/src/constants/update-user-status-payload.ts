import type { TUpdateUserPayload } from '../requests';
import { UPDATE_USER_PARAM_TYPE } from './update-user-enums';

export const CHANGE_USER_STATUS_ACTION_TYPES = {
  ban: 'ban',
  unban: 'unban',
  freeze: 'freeze',
  unfreeze: 'unfreeze',
} as const;

export const UPDATE_USER_STATUS_PAYLOAD_MAP: Map<TChangeUserStatusActionType, Pick<TUpdateUserPayload, 'paramType' | 'paramValue'>> = new Map([
  [CHANGE_USER_STATUS_ACTION_TYPES.ban, { paramType: UPDATE_USER_PARAM_TYPE.ACTIVE, paramValue: false }],
  [CHANGE_USER_STATUS_ACTION_TYPES.unban, { paramType: UPDATE_USER_PARAM_TYPE.ACTIVE, paramValue: true }],
  [CHANGE_USER_STATUS_ACTION_TYPES.freeze, { paramType: UPDATE_USER_PARAM_TYPE.FROZEN, paramValue: true }],
  [CHANGE_USER_STATUS_ACTION_TYPES.unfreeze, { paramType: UPDATE_USER_PARAM_TYPE.FROZEN, paramValue: false }],
]);

export const SUCCESS_CLIENT_UPDATE_NOTIFICATION_MESSAGES: Map<TChangeUserStatusActionType, string> = new Map([
  [CHANGE_USER_STATUS_ACTION_TYPES.ban, 'notification.client_profile_blocked'],
  [CHANGE_USER_STATUS_ACTION_TYPES.unban, 'notification.client_profile_unblocked'],
  [CHANGE_USER_STATUS_ACTION_TYPES.freeze, 'notification.client_profile_frozen'],
  [CHANGE_USER_STATUS_ACTION_TYPES.unfreeze, 'notification.client_profile_unfrozen'],
]);

export const SUCCESS_USER_UPDATE_NOTIFICATION_MESSAGES: Map<TChangeUserStatusActionType, string> = new Map([
  [CHANGE_USER_STATUS_ACTION_TYPES.ban, 'notification.user_profile_blocked'],
  [CHANGE_USER_STATUS_ACTION_TYPES.unban, 'notification.user_profile_unblocked'],
  [CHANGE_USER_STATUS_ACTION_TYPES.freeze, 'notification.user_profile_frozen'],
  [CHANGE_USER_STATUS_ACTION_TYPES.unfreeze, 'notification.user_profile_unfrozen'],
]);

export type TChangeUserStatusActionType = (typeof CHANGE_USER_STATUS_ACTION_TYPES)[keyof typeof CHANGE_USER_STATUS_ACTION_TYPES];
