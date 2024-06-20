import type { AxiosResponse } from 'axios';

const isAxiosResponse = (value: unknown): value is AxiosResponse => !!(value as AxiosResponse).headers || !!(value as AxiosResponse).data;

export function downloadFile(response: AxiosResponse, name?: string): void;
export function downloadFile(objectUrl: string, name?: string): void;
export function downloadFile(responseOrObjectUrl: AxiosResponse | string, name = ''): void {
  let url: string;
  let fileNameFull: string;

  if (isAxiosResponse(responseOrObjectUrl)) {
    url = window.URL.createObjectURL(responseOrObjectUrl.data);

    const [, originFileNameFull] = responseOrObjectUrl?.headers['content-disposition']?.split('filename=') || [''];
    const [, ...ext] = originFileNameFull.split('.');
    fileNameFull = name ? `${name}-${Date.now()}.${ext.join('.')}` : originFileNameFull;
  } else {
    url = responseOrObjectUrl;
    fileNameFull = name;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = fileNameFull;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (isAxiosResponse(responseOrObjectUrl)) {
    window.URL.revokeObjectURL(url);
  }
}
