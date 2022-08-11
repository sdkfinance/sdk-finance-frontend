import { AxiosResponse } from 'axios';

export function downloadFile(response: AxiosResponse, name = ''): void {
  const url: string = window.URL.createObjectURL(response.data);

  const [, originFileNameFull] = response?.headers['content-disposition']?.split('filename=') || [''];
  const [, ...ext] = originFileNameFull.split('.');
  const fileNameFull = name ? `${name}-${Date.now()}.${ext.join('.')}` : originFileNameFull;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileNameFull);
  link.click();

  window.URL.revokeObjectURL(url);
  link.remove();
}
