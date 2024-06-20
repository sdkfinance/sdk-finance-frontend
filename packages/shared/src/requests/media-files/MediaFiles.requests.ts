import type { AxiosResponse } from 'axios';

import { api } from '../../api';
import type { TUploadMediaApiResponse } from './MediaFiles.types';

export const MEDIA_FILES_RESOURCES_PATH = '/media-files/resources/';

export const MediaFilesRequests = {
  downloadFile(fileId: string): Promise<AxiosResponse<Blob>> {
    return api.get(`/media-files/${fileId}`, {
      responseType: 'blob',
    });
  },
  downloadFileFromResources(fileName: string) {
    return api.get(`${MEDIA_FILES_RESOURCES_PATH}${fileName}`, { responseType: 'blob' });
  },
  uploadMedia(form: FormData): Promise<TUploadMediaApiResponse> {
    return api.post('/media-files', form);
  },
};
