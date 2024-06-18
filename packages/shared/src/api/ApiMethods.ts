import type { AxiosInstance } from 'axios';

import type { TAxiosMethods } from './types';

type IApiMethods = TAxiosMethods;

export default class ApiMethods implements IApiMethods {
  protected readonly axiosInstance: AxiosInstance;

  public get: TAxiosMethods['get'];

  public delete: TAxiosMethods['delete'];

  public post: TAxiosMethods['post'];

  public put: TAxiosMethods['put'];

  public patch: TAxiosMethods['patch'];

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    this.get = this.axiosInstance.get;
    this.delete = this.axiosInstance.delete;
    this.post = this.axiosInstance.post;
    this.put = this.axiosInstance.put;
    this.patch = this.axiosInstance.patch;
  }
}
