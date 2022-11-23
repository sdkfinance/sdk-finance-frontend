import axios, { AxiosError, AxiosResponse } from 'axios';
import { getModule } from 'vuex-module-decorators';

import { LocalStorageService } from '@/services/LocalStorageService';
import store from '@/store';
import { UserData } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';

declare module 'axios' {
  interface AxiosResponse<T = any> {
    response: T;
    error: any;
  }
  interface AxiosError {
    error: any;
  }
}

export const getAuthHeader = (): IPlainObject => {
  const token = LocalStorageService.get('token');

  return token ? { Authorization: `TOKEN ${token}` } : {};
};

const { BASE_URL } = process.env;

export const apiConfig = {
  baseURL: `${BASE_URL}api/v1`,
};

const createApiInstance = () => {
  const api = axios.create(apiConfig);
  let userDataModule: any;

  api.interceptors.request.use(
    (options) => {
      if (!options?.headers?.Authorization) {
        options.headers = {
          ...options.headers,
          ...getAuthHeader(),
        };
      }

      return options;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response): Promise<AxiosResponse> => Promise.resolve({
      ...response,
      originalResponse: response,
      error: null,
      response: response.data,
    }),
    async (error): Promise<AxiosError> => {
      const { status, config } = error.response;

      if (!userDataModule) {
        userDataModule = getModule(UserData, store);
      }

      if (status === 401 && config.url !== '/authorization') {
        await userDataModule.logout();
      }

      return Promise.resolve({
        ...error,
        originalResponse: error,
        response: null,
        error: error?.response?.data || true,
      });
    },
  );
  return api;
};

export default createApiInstance();
