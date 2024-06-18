import type { AxiosInstance } from 'axios';

import type { ApiVersion } from '../constants';

export type TApiInternal = TAxiosMethods & Pick<AxiosInstance, 'defaults'> & Partial<Record<ApiVersion, TAxiosMethods>>;
export type TAxiosMethods = Pick<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'>;

declare module 'axios' {
  interface AxiosResponse<T = any> {
    response: T;
    error: any;
  }

  interface AxiosError {
    error: any;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: TApiInternal;
  }

  interface VueConstructor {
    $api: TApiInternal;
  }
}
