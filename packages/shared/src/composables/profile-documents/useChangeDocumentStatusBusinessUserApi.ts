import { useMutation } from '@tanstack/vue-query';

import type { IChangeUserDocumentStatusRequestPayload } from '../../requests';
import { ProfileDocumentsRequests } from '../../requests';
import { errorNotification } from '../../utils';

export const useChangeDocumentStatusBusinessUserApi = () => {
  return useMutation({
    mutationFn: (payload: IChangeUserDocumentStatusRequestPayload & { documentId: string }) => {
      const { documentId, ...updatePayload } = payload;
      return ProfileDocumentsRequests.changeDocumentStatusBusinessUser(documentId, updatePayload);
    },
    onSuccess: ({ error }) => {
      if (error !== null) {
        errorNotification(error);
      }
    },
  });
};
