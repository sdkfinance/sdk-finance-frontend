import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import Vue from 'vue';
import VueI18n, { IVueI18n, LocaleMessages } from 'vue-i18n';

import en from './en';

Vue.use(VueI18n);

export const messages: LocaleMessages = {
  en,
};

export const i18n: IVueI18n = new VueI18n({
  fallbackLocale: 'en',
  messages,
  silentTranslationWarn: true,
});

export const translate = (key: string = '') => i18n.t(key);

Vue.use(VueI18n);
Vue.use(Element, {
  locale,
});
