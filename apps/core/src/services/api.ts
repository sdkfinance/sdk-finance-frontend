import type { IServerError } from '@sdk5/shared';
import { errorNotification, UserDataService } from '@sdk5/shared';
import ApiConfigInstance, { UnsecureApiConfigInstance } from '@sdk5/shared/api';
import type { AxiosHeaders, AxiosResponse } from 'axios';
import { AxiosError } from 'axios';

const isServerError = (value: unknown): value is IServerError => {
  return !!(value as IServerError).mdcId || !!(value as IServerError).code;
};

function getSetupResponseInterceptorOptions() {
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
      if (!isServerError(error) && error instanceof AxiosError) {
        errorNotification(error.message);
        return Promise.resolve(error);
      }

      const { status, config } = error.response;

      if (status === 401 && config.url !== '/authorization') {
        await UserDataService.logout();
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
