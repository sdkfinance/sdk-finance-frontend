import { availableApiVersions, defaultApiVersion } from '../constants/api-versions';
import type { TApiConfigOptions } from './ApiConfig';
import ApiConfig from './ApiConfig';

export { default as ApiConfig } from './ApiConfig';
export { default as ApiMethods } from './ApiMethods';
export { default as ApiMethodsSpecificVersion } from './ApiMethodsSpecificVersion';
export * from './types';

const apiConfigOptions: TApiConfigOptions = {
  apiVersions: availableApiVersions,
  currentApiVersion: defaultApiVersion,
  baseUrl: import.meta.env.BASE_URL,
};

export const apiConfigInstance = new ApiConfig(apiConfigOptions);
export const UnsecureApiConfigInstance = new ApiConfig(apiConfigOptions);

export const { api, apiConfig, getAuthHeader } = apiConfigInstance;
export const { api: unsecureApi } = UnsecureApiConfigInstance;

export default apiConfigInstance;
