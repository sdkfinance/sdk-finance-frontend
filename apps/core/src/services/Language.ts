import { api } from '@sdk5/shared/api';
import type { TLanguageCode } from '@sdk5/shared/constants';
import { LANGUAGE_CODES, LANGUAGES } from '@sdk5/shared/constants';
import { i18n, messages } from '@sdk5/shared/i18n';
import { I18nRequests } from '@sdk5/shared/requests';
import { LocalStorageService } from '@sdk5/shared/services';
import type { IOption } from '@sdk5/shared/types';

export class LanguageService {
  public static getCurrentLanguage(): string {
    const storageLanguage = LocalStorageService.get('language');
    return storageLanguage || i18n.locale;
  }

  protected static async setServerVariables(locale: TLanguageCode): Promise<void> {
    const { response } = await I18nRequests.getTranslations(locale);

    if (!response) {
      return;
    }

    const scopedServerMessages = Object.entries(response).reduce(
      (acc, [responseKey, value]) => {
        acc[`__server_errors.${responseKey}`] = value;
        acc[responseKey] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    i18n.mergeLocaleMessage(locale, scopedServerMessages);
  }

  public static async setLanguage(locale: TLanguageCode): Promise<void> {
    LocalStorageService.set('language', locale);
    i18n.locale = locale;
    api.defaults.headers.common['Accept-Language'] = locale;
    await this.setServerVariables(locale);
  }

  public static getAllLanguages(): IOption[] {
    return Object.keys(messages)
      .filter((lang) => LANGUAGES[lang as TLanguageCode])
      .map((lang) => LANGUAGES[lang as TLanguageCode]);
  }

  public static async setUserStorageLanguage(): Promise<void> {
    const storageLanguage = LocalStorageService.get('language');
    await this.setLanguage(storageLanguage || LANGUAGE_CODES.en);
  }
}
