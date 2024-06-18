import Element from 'element-ui';
// @ts-ignore
import elementLocale from 'element-ui/lib/locale/lang/en';
import type { VueConstructor, WritableComputedRef } from 'vue';
import Vue, { computed, getCurrentInstance } from 'vue';
import VueI18n, { type IVueI18n, type LocaleMessages } from 'vue-i18n';

import en from './en';

export interface I18nComposer {
  locale: WritableComputedRef<string>;
  t: typeof VueI18n.prototype.t;
  tc: typeof VueI18n.prototype.tc;
  te: typeof VueI18n.prototype.te;
  d: typeof VueI18n.prototype.d;
  n: typeof VueI18n.prototype.n;
}

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

Vue.use(Element, {
  locale: elementLocale,
});

export function useI18n(): I18nComposer {
  if (!i18n) {
    throw new Error('vue-i18n not initialized');
  }

  const instance = getCurrentInstance();
  const vm = instance?.proxy || (instance as unknown as InstanceType<VueConstructor>) || new Vue({});

  const locale = computed({
    get() {
      return i18n.locale;
    },
    set(v: string) {
      i18n.locale = v;
    },
  });

  return {
    locale,
    t: vm.$t.bind(vm),
    tc: vm.$tc.bind(vm),
    d: vm.$d.bind(vm),
    te: vm.$te.bind(vm),
    n: vm.$n.bind(vm),
  };
}
