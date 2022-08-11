import Vue from 'vue';
import { LanguageService } from '@/services/Language';
import App from './App.vue';
import router from './router';
import store from './store';
import { i18n } from './i18n';
import '@/plugins';
import '@/directives/index';
import '@/assets/styles/global/index.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

LanguageService.setUserStorageLanguage();
