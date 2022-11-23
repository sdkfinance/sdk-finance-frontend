import '@/plugins';
import '@/directives/index';
import '@/assets/styles/global/index.scss';

import Vue from 'vue';

import { LanguageService } from '@/services/Language';

import App from './App.vue';
import { i18n } from './i18n';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

LanguageService.setUserStorageLanguage();
