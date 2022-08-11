import { LocalStorageService } from '@/services/LocalStorageService';
import { i18n, messages } from '@/i18n';
import api from '@/services/api';
import { LANGUAGES } from '@/constants';
import { IOption } from '@/types/interfaces/Options.interface';
import { I18nRequests } from '@/services/requests/i18n/I18nRequests';
import { LANGUAGE_CODES } from '@/constants/languages';
import { IPlainObject } from '@/types/interfaces';

export class LanguageService {

  public static getCurrentLanguage(): string {
    const storageLanguage = LocalStorageService.get('language');
    return storageLanguage || i18n.locale;
  }

  protected static async setServerVariables(locale: string): Promise<void> {

    const { response } = await I18nRequests.getTranslations(locale);

    if (response) {
      const scopedServerMessages: IPlainObject = {};
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const responseKey in response) {
        scopedServerMessages[`__server_errors.${responseKey}`] = response[responseKey];
      }
      i18n.mergeLocaleMessage(locale, scopedServerMessages);
    }
  }

  public static setLanguage(locale: string): void {
    LocalStorageService.set('language', locale);
    i18n.locale = locale;
    api.defaults.headers.common['Accept-Language'] = locale;
    this.setServerVariables(locale);
  }

  public static getAllLanguages(): IOption[] {
    return Object.keys(messages)
      .filter((lang) => LANGUAGES[lang])
      .map((lang) => LANGUAGES[lang]);
  }

  public static setUserStorageLanguage(): void {
    const storageLanguage = LocalStorageService.get('language');
    this.setLanguage(storageLanguage || LANGUAGE_CODES.en);
  }

}
