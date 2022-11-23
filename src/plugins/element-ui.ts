import '@/assets/styles/ui-framework/styles.scss';

import { Loading, Notification } from 'element-ui';
import locale from 'element-ui/lib/locale/index';
import en from 'element-ui/lib/locale/lang/en';
import Vue from 'vue';

const options = {
  size: 'medium',
};

locale.use(en);
Vue.use(Loading.directive);

Vue.prototype.$ELEMENT = options;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notification = Notification;
