import Vue from 'vue';
import resize from 'vue-resize-directive';

import { clickOutside } from './click-outside';
import { onSticky } from './sticky';

Vue.directive('resize', resize);
Vue.directive('sticky', onSticky());
Vue.directive('clickOutside', clickOutside());
