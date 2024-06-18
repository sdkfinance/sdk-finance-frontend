import apiConfigInstance from '../../api';
import type { TLanguageCode } from '../../constants';
import type { IApiResponse } from '../../types';

export const I18nRequests = {
  getTranslations(locale: TLanguageCode = 'en', type: 'json' | 'property' = 'json'): Promise<IApiResponse<Record<string, string>>> {
    return apiConfigInstance.api.get(`/i18n/export/${locale}.${type}`, {
      responseType: 'json',
    });
  },
};
