import { useMutation, useQueryClient } from '@tanstack/vue-query';

import type { TChangeUserStatusActionType } from '../../constants';
import { QUERY_KEYS, SUCCESS_CLIENT_UPDATE_NOTIFICATION_MESSAGES, UPDATE_USER_STATUS_PAYLOAD_MAP } from '../../constants';
import type { TUpdateUserPayload } from '../../requests';
import { UsersRequests } from '../../requests';
import { errorNotification, successNotification } from '../../utils';

export const useUpdateUserStatusApi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Pick<TUpdateUserPayload, 'reason' | 'description'> & {
        userId: string;
        actionType: TChangeUserStatusActionType;
        successNotificationMessagesMap?: Map<TChangeUserStatusActionType, string>;
      },
    ) => {
      const { actionType, userId, successNotificationMessagesMap, ...formPayload } = payload;

      const commonPayloadByActionType = UPDATE_USER_STATUS_PAYLOAD_MAP.get(actionType);

      if (!commonPayloadByActionType) {
        throw new Error(`Invalid action type: ${actionType}`);
      }

      const updatePayload = {
        ...commonPayloadByActionType,
        ...formPayload,
      };

      return UsersRequests.updateUserStatus(userId, updatePayload);
    },
    onSettled: (data, _, payload) => {
      if (!data) {
        return;
      }

      const { error } = data;

      if (error !== null) {
        errorNotification(error);
        return;
      }

      const { actionType, successNotificationMessagesMap = SUCCESS_CLIENT_UPDATE_NOTIFICATION_MESSAGES } = payload;
      const notificationMessage = successNotificationMessagesMap.get(actionType);

      successNotification(notificationMessage);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getUsers] });
    },
  });
};
