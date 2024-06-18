import { EXPORT_STATUSES } from '../constants';
import { MediaFilesRequests } from '../requests';
import type { IApiResponse } from '../types';
import { errorNotification } from '.';
import { downloadFile } from './downloadFile';

type TInitMethod<T> = (params: T) => Promise<IApiResponse<any>>;
type TInfoMethod = (jobKey: string) => Promise<IApiResponse<any>>;
type TDownloadMethod = (fileId: string) => Promise<IApiResponse<Blob>>;
type TInit<T> = (params: T) => Promise<void>;

async function getFileId(infoMethod: TInfoMethod, jobKey: string): Promise<string | null> {
  return new Promise((resolve) => {
    const checkFileInfo = async (): Promise<void> => {
      const { response, error } = await infoMethod(jobKey);
      const {
        exportInfo: { exportStatus, fileId },
      } = response || { exportInfo: {} };

      if (error || [EXPORT_STATUSES.NOT_FOUND, null].includes(exportStatus)) {
        errorNotification(error || 'notification.not_found');
        resolve(null);
        return;
      }

      if (exportStatus === EXPORT_STATUSES.COMPLETE) {
        resolve(fileId);
        return;
      }

      await checkFileInfo();
    };

    checkFileInfo();
  });
}

export const getExportFile = <T>(
  initMethod: TInitMethod<T>,
  infoMethod: TInfoMethod,
  downloadMethod: TDownloadMethod = MediaFilesRequests.downloadFile,
): { init: TInit<T> } => ({
  async init(params): Promise<void> {
    const { response, error } = await initMethod(params);

    if (error) {
      errorNotification(error);
    }

    const fileId = await getFileId(infoMethod, response.id);

    if (fileId) {
      const { originalResponse, error: downloadError } = await downloadMethod(fileId);

      if (downloadError) {
        errorNotification(downloadError);
        return;
      }

      if (originalResponse) {
        downloadFile(originalResponse);
      }
    }
  },
});
