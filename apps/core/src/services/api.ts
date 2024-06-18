import ApiConfigInstance, { UnsecureApiConfigInstance } from '@sdk5/shared/api';
import { UserData } from '@sdk5/shared/store';
import type { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { getModule } from 'vuex-module-decorators';

import store from '@/store';

function getSetupResponseInterceptorOptions() {
  let userDataModule: any;
  return {
    onFulfilled: (response: AxiosResponse<any, any>) => {
      return Promise.resolve({
        ...response,
        originalResponse: response,
        error: null,
        response: response.data,
      });
    },
    onRejected: async (error: any): Promise<AxiosError> => {
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
  };
}

export function setupApiInterceptors() {
  ApiConfigInstance.setupRequestInterceptor(
    (options) => {
      if (!options?.headers?.Authorization) {
        options.headers = {
          ...options.headers,
          ...ApiConfigInstance.getAuthHeader(),
        } as AxiosHeaders;
      }

      return options;
    },
    (error) => Promise.reject(error),
  );
  const { onFulfilled, onRejected } = getSetupResponseInterceptorOptions();
  ApiConfigInstance.setupResponseInterceptor(onFulfilled, onRejected);
  UnsecureApiConfigInstance.setupResponseInterceptor(onFulfilled, onRejected);
}
