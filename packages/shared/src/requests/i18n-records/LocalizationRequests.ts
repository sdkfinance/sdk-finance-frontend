import apiConfigInstance from '../../api';
import type { IApiResponse, IPlainObject } from '../../types';
import type { IGetLocalizationsApiResponse, ILocalizationCreateBody, ILocalizationOptions, ILocalizationUpdateBody } from './Localization.interface';

const { api } = apiConfigInstance;
export const LocalizationRequests = {
  getLocales(): Promise<IApiResponse<IPlainObject>> {
    return api.post('/i18n-records/view-locales');
  },

  getRecords(options: ILocalizationOptions): Promise<IGetLocalizationsApiResponse> {
    return api.post('/i18n-records/view', options);
  },

  create(options: ILocalizationCreateBody): Promise<IApiResponse<IPlainObject>> {
    return api.post('/i18n-records', options);
  },

  update(id: number, options: ILocalizationUpdateBody): Promise<IApiResponse<IPlainObject>> {
    return api.patch(`/i18n-records/${id}`, options);
  },

  delete(id: number): Promise<IApiResponse<IPlainObject>> {
    return api.delete(`/i18n-records/${id}`);
  },

  export(): Promise<IApiResponse<IPlainObject>> {
    return api.post('/i18n-records/export');
  },

  import(file: FormData): Promise<IApiResponse<IPlainObject>> {
    return api.post('/i18n-records/import', file);
  },
};
