import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import ApiMethods from './ApiMethods';

export default class ApiMethodsSpecificVersion extends ApiMethods {
  private readonly baseUrl: string;

  constructor(options: { axiosInstance: AxiosInstance; requestBaseUrl: string }) {
    const { axiosInstance, requestBaseUrl } = options;
    super(axiosInstance);
    this.baseUrl = requestBaseUrl;
    this.get = this.getPatched;
    this.delete = this.deletePatched;
    this.post = this.postPatched;
    this.put = this.putPatched;
    this.patch = this.patchPatched;
  }

  private getPatched<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axiosInstance.get<T, R, D>(url, {
      ...(config ?? {}),
      baseURL: this.baseUrl,
    });
  }

  private deletePatched<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axiosInstance.delete<T, R, D>(url, {
      ...(config ?? {}),
      baseURL: this.baseUrl,
    });
  }

  private postPatched<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axiosInstance.post<T, R, D>(url, data, {
      ...(config ?? {}),
      baseURL: this.baseUrl,
    });
  }

  private putPatched<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axiosInstance.put<T, R, D>(url, data, {
      ...(config ?? {}),
      baseURL: this.baseUrl,
    });
  }

  private patchPatched<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.axiosInstance.patch<T, R, D>(url, data, {
      ...(config ?? {}),
      baseURL: this.baseUrl,
    });
  }
}
