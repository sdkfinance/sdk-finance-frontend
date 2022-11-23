import api from '@/services/api';
import {
  IGetLocalizationsApiResponse,
  ILocalizationCreateBody,
  ILocalizationOptions,
  ILocalizationUpdateBody,
} from '@/services/requests/i18n-records/Localization.interface';
import { IApiResponse, IPlainObject } from '@/types/interfaces';

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
