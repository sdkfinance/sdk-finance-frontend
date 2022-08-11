import { IApiResponse } from '@/types/interfaces';
import api from '@/services/api';

export const MediaFilesRequests = {

  downloadFile(fileId: string, token: string = ''): Promise<IApiResponse<Blob>> {
    return api.get(`/media-files/${fileId}/${token}`, {
      responseType: 'blob',
    });
  },
};
