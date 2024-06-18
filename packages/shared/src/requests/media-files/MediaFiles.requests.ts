import apiConfig from '../../api';
import type { IApiResponse } from '../../types';

export const MediaFilesRequests = {
  downloadFile(fileId: string): Promise<IApiResponse<Blob>> {
    return apiConfig.api.get(`/media-files/${fileId}`, {
      responseType: 'blob',
    });
  },
};
