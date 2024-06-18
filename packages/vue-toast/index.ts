import './scss/index.scss';

import _Vue, { PluginFunction } from 'vue';
import { VueConstructor } from 'vue/types/vue';

import { POSITION, TYPE } from './constants';
import { ToastInterface } from './toast';
import { PluginOptions } from './types';

function createToastInterface(eventBus: InstanceType<VueConstructor>): ReturnType<typeof ToastInterface>;
function createToastInterface(options?: PluginOptions, Vue?: VueConstructor): ReturnType<typeof ToastInterface>;
function createToastInterface(optionsOrEventBus?: PluginOptions | InstanceType<VueConstructor>, Vue = _Vue) {
  const isVueInstance = (obj: unknown): obj is InstanceType<VueConstructor> => obj instanceof Vue;

  if (isVueInstance(optionsOrEventBus)) {
    return ToastInterface(Vue, { eventBus: optionsOrEventBus }, false);
  }

  return ToastInterface(Vue, optionsOrEventBus, true);
}

const VueToastPlugin: PluginFunction<PluginOptions> = (Vue, options?) => {
  const toast = createToastInterface(options, Vue);
  Vue.$toast = toast;
  Vue.prototype.$toast = toast;
};

export default VueToastPlugin;

export { POSITION, TYPE, createToastInterface, type PluginOptions };
export * from './types';
