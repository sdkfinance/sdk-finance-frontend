import api from '@/services/api';
import { IApiResponse, IPlainObject } from '@/types/interfaces';

export const I18nRequests = {
  getTranslations(locale: string = 'en', type: 'json' | 'property' = 'json'): Promise<IApiResponse<IPlainObject>> {
    return api.get(`/i18n/export/${locale}.${type}`);
  },
};
