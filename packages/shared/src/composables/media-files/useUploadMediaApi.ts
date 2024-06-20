import { useMutation } from '@tanstack/vue-query';

import { MediaFilesRequests } from '../../requests';
import type { TUseMutationsApiCommonOptions } from '../../types';
import { errorNotification } from '../../utils';

type TUseUploadMediaApiOptions = Pick<TUseMutationsApiCommonOptions, 'showErrorNotification'>;

export const useUploadMediaApi = (options: TUseUploadMediaApiOptions = {}) => {
  const { showErrorNotification } = options;
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return MediaFilesRequests.uploadMedia(formData);
    },
    onSettled: (data) => {
      if (showErrorNotification === false || !data || !data.error) {
        return;
      }

      errorNotification(data.error);
    },
  });
};
