import api from '@/services/api';
import { IApiResponse } from '@/types/interfaces';

export const MediaFilesRequests = {

  downloadFile(fileId: string, token: string = ''): Promise<IApiResponse<Blob>> {
    return api.get(`/media-files/${fileId}/${token}`, {
      responseType: 'blob',
    });
  },
};
