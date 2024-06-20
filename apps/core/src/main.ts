import '@/assets/styles/global/index.scss';
import '@/directives/index';
import '@/plugins';
import './assets/icomoon/style.css';

import { i18n } from '@sdk5/shared/i18n';
import router from '@sdk5/shared/router';
import { initGoogleTag } from '@sdk5/shared/utils';
import type { PluginOptions as VueToastPluginOptions } from '@sdk5/vue-toast';
import VueToast, { POSITION } from '@sdk5/vue-toast';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Vue from 'vue';

import { LanguageService } from '@/services/Language';

import App from './App.vue';
import { setupAppRoutes } from './router';
import { setupApiInterceptors } from './services/api';
import store from './store';
import { setupAppColors } from './utils/setupAppColors';

setupAppColors();

if (import.meta.env.VUE_APP_INIT_GOOGLE_TAG === 'true') {
  initGoogleTag(import.meta.env.VUE_APP_GOOGLE_TAG_ID);
}

Vue.config.productionTip = false;

const vueToastOptions: VueToastPluginOptions = {
  position: POSITION.TOP_RIGHT,
  toastClassName: 'app-toast',
  containerClassName: 'app-toast-container',
};

Vue.use(VueToast, vueToastOptions);
Vue.use(VueQueryPlugin);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

setupAppRoutes();
setupApiInterceptors();
LanguageService.setUserStorageLanguage();
