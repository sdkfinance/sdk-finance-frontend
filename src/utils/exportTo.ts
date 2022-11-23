import { AxiosRequestConfig } from 'axios';
import { saveAs } from 'file-saver';

import api from '@/services/api';

const exportTo = async (
  uri: string,
  fileName: string = 'export-file',
  type: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
): Promise<any> => {
  try {
    const config: AxiosRequestConfig = {
      responseType: 'blob',
      timeout: 100000000,
    };
    const { response, error } = await api.post(uri, {}, config);
    const file = new File([response], fileName, { type });
    await saveAs(file, fileName);

    if (error) return { error };

    return { response };

  } catch (error) {
    return { error };
  }
};

export { exportTo };
