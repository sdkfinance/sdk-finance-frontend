import type { AxiosInstance, AxiosInterceptorOptions, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

import type { ApiVersion } from '../constants/api-versions';
import { LocalStorageService } from '../services/LocalStorageService';
import ApiMethods from './ApiMethods';
import ApiMethodsSpecificVersion from './ApiMethodsSpecificVersion';
import type { TApiInternal } from './types';

interface IApiConfig {
  api: TApiInternal;
  apiConfig: AxiosRequestConfig;
}

export type TApiConfigOptions = {
  apiVersions: readonly ApiVersion[];
  currentApiVersion: ApiVersion;
  baseUrl: string;
};

const DEFAULT_TIMEOUT = 10 * 1000;

export default class ApiConfig implements IApiConfig {
  private readonly appBaseUrl: string;

  private readonly apiVersions: readonly ApiVersion[];

  private readonly defaultVersion: ApiVersion;

  private readonly axiosInstance: AxiosInstance;

  private readonly apiInternal: TApiInternal;

  readonly apiConfig: AxiosRequestConfig;

  constructor(options: TApiConfigOptions) {
    const { apiVersions, currentApiVersion, baseUrl } = options;

    const apiConfigTimeOut = import.meta.env.VUE_APP_API_REQUEST_TIMEOUT ? parseInt(import.meta.env.VUE_APP_API_REQUEST_TIMEOUT) : DEFAULT_TIMEOUT;
    this.appBaseUrl = baseUrl;
    this.apiVersions = apiVersions;
    this.defaultVersion = currentApiVersion;
    this.apiConfig = {
      baseURL: this.getBaseUrl(),
      timeout: Number.isNaN(apiConfigTimeOut) ? DEFAULT_TIMEOUT : apiConfigTimeOut,
    };
    this.axiosInstance = axios.create(this.apiConfig);
    const commonAxiosMethods = new ApiMethods(this.axiosInstance);
    this.apiInternal = {
      ...commonAxiosMethods,
      defaults: this.axiosInstance.defaults,
    } as TApiInternal;

    this.setupApi();
  }

  public get api() {
    return this.apiInternal as IApiConfig['api'];
  }

  public getAuthHeader(): {} {
    const token = LocalStorageService.get<string>('token');

    return token ? { Authorization: `TOKEN ${token}` } : {};
  }

  private getBaseUrl(): string {
    return `${this.appBaseUrl}api/${this.defaultVersion}`;
  }

  private setupApi() {
    this.apiVersions.forEach((version) => {
      (this.apiInternal as any)[version] = new ApiMethodsSpecificVersion({
        axiosInstance: this.axiosInstance,
        requestBaseUrl: this.getBaseUrl.call({ appBaseUrl: this.appBaseUrl, defaultVersion: version }),
      });
    });
  }

  public setupRequestInterceptor(
    onFulfilled?: ((value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>) | null,
    onRejected?: ((error: any) => any) | null,
    options?: AxiosInterceptorOptions,
  ) {
    this.axiosInstance.interceptors.request.use(onFulfilled, onRejected, options);
  }

  public setupResponseInterceptor(
    onFulfilled?: ((value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>) | null,
    onRejected?: ((error: any) => any) | null,
    options?: AxiosInterceptorOptions,
  ) {
    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected, options);
  }
}
