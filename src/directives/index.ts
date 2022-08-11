import Vue from 'vue';
import resize from 'vue-resize-directive';
import { onSticky } from '@/directives/sticky';
import { clickOutside } from '@/directives/click-outside';

Vue.directive('resize', resize);
Vue.directive('sticky', onSticky());
Vue.directive('clickOutside', clickOutside());
