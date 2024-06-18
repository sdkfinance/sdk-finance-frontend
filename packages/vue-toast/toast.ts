import { VueConstructor } from 'vue/types';

import ToastContainer from './components/ToastContainer.vue';
import { EVENTS, TType, TYPE } from './constants';
import { PluginOptions, ToastContent, ToastID, ToastOptions, ToastOptionsAndRequiredContent } from './types';
import { getId, isUndefined } from './utils';

type TShowToast<O extends ToastOptions = ToastOptions> = {
  /**
   * Display a toast
   */
  (content: ToastContent, options?: O): ToastID;
};

type TShowToastByType = {
  [K in TType]: TShowToast<ToastOptions & { type?: K }>;
};

interface IToast extends TShowToast, TShowToastByType {
  /**
   * Clear all toasts
   */
  clear(): void;
  /**
   * Update Plugin Defaults
   */
  updateDefaults(update: PluginOptions): void;
  /**
   * Dismiss toast specified by an id
   */
  dismiss(toastId: ToastID): void;
  /**
   * Update Toast
   */
  update(id: ToastID, { content, options }: { content?: ToastContent; options?: ToastOptions }, create?: false): void;
  update(id: ToastID, { content, options }: { content?: ToastContent; options?: ToastOptions }, create?: true): void;
}

const ToastInterface = (Vue: VueConstructor, globalOptions: PluginOptions = {}, mountContainer = true) => {
  const globalOptionsLocal: Required<Pick<PluginOptions, 'eventBus'>> & PluginOptions = {
    ...globalOptions,
    // TODO: replace with alternative event emitter ("mitt")
    eventBus: globalOptions.eventBus || new Vue(),
  };

  const events = globalOptionsLocal.eventBus;

  if (mountContainer) {
    const containerComponent = new (Vue.extend(ToastContainer as any))({
      el: document.createElement('div'),
      propsData: globalOptionsLocal,
    });
    const { onMounted } = globalOptionsLocal;

    if (!isUndefined(onMounted)) {
      onMounted(containerComponent);
    }
  }

  const showToast: TShowToast = (content: ToastContent, options?: ToastOptions): ToastID => {
    const props: ToastOptionsAndRequiredContent & {
      id: ToastID;
    } = {
      id: getId(),
      type: TYPE.DEFAULT,
      ...options,
      content,
    };

    events.$emit(EVENTS.ADD, props);
    return props.id;
  };

  const toast = showToast as unknown as IToast;

  toast.clear = () => events.$emit(EVENTS.CLEAR);

  toast.updateDefaults = (update: PluginOptions) => {
    events.$emit(EVENTS.UPDATE_DEFAULTS, update);
  };

  toast.dismiss = (id: ToastID) => {
    events.$emit(EVENTS.DISMISS, id);
  };

  toast.update = (id: ToastID, { content, options }: { content?: ToastContent; options?: ToastOptions }, create = false): void => {
    events.$emit(EVENTS.UPDATE, {
      id,
      options: { ...options, content },
      create,
    });
  };

  Object.values(TYPE).forEach((type) => {
    toast[type] = (content: ToastContent, options?: ToastOptions) => toast(content, { type, ...options });
  });

  return toast;
};

export { ToastInterface };

declare module 'vue/types/vue' {
  interface Vue {
    $toast: ReturnType<typeof ToastInterface>;
  }

  interface VueConstructor {
    $toast: ReturnType<typeof ToastInterface>;
  }
}
