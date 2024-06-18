import { PropType } from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';

import { CommonOptions, PluginOptions, ToastContent, ToastID, ToastOptions, ToastOptionsAndRequiredContent } from '../types';
import { POSITION, TPosition, TType, TYPE, VT_NAMESPACE } from './common';

type CommonOptionsType = Required<CommonOptions>;
type ToastOptionsType = Required<Omit<ToastOptionsAndRequiredContent, keyof CommonOptionsType>>;

export type PluginOptionsType = Required<Omit<PluginOptions, keyof CommonOptionsType>>;

const COMMON_PROPS = {
  type: {
    type: String as PropType<TType>,
    default: TYPE.DEFAULT,
  },
  classNames: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  trueBoolean: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
};

const TRANSITION_PROPS = {
  transition: {
    type: [Object, String] as PropType<NonNullable<PluginOptions['transition']>>,
    default: `${VT_NAMESPACE}__bounce`,
  },
  transitionDuration: {
    type: [Number, Object] as PropType<NonNullable<PluginOptions['transitionDuration']>>,
    default: 750,
  },
};

const PROGRESS_BAR_PROPS = {
  timeout: {
    type: [Number, Boolean] as PropType<number | false>,
    default: 5000,
  },
  hideProgressBar: Boolean as PropType<boolean>,
  isRunning: Boolean as PropType<boolean>,
};

const CLOSE_BUTTON_PROPS = {
  component: {
    type: [String, Object, Function, Boolean] as PropType<NonNullable<CommonOptions['closeButton']>>,
    default: 'button' as keyof HTMLElementTagNameMap,
  },
  classNames: COMMON_PROPS.classNames,
  showOnHover: Boolean as PropType<boolean>,
  ariaLabel: {
    type: String as PropType<string>,
    default: 'close',
  },
};

const CORE_TOAST_PROPS: RecordPropsDefinition<CommonOptionsType> = {
  position: {
    type: String as PropType<TPosition>,
    default: POSITION.TOP_RIGHT,
  },
  draggable: COMMON_PROPS.trueBoolean,
  draggablePercent: {
    type: Number as PropType<number>,
    default: 0.6,
  },
  pauseOnFocusLoss: COMMON_PROPS.trueBoolean,
  pauseOnHover: COMMON_PROPS.trueBoolean,
  closeOnClick: COMMON_PROPS.trueBoolean,
  timeout: PROGRESS_BAR_PROPS.timeout,
  hideProgressBar: PROGRESS_BAR_PROPS.hideProgressBar,
  toastClassName: COMMON_PROPS.classNames,
  bodyClassName: COMMON_PROPS.classNames,
  closeButton: CLOSE_BUTTON_PROPS.component,
  closeButtonClassName: CLOSE_BUTTON_PROPS.classNames,
  showCloseButtonOnHover: CLOSE_BUTTON_PROPS.showOnHover,
  accessibility: {
    type: Object as PropType<NonNullable<PluginOptions['accessibility']>>,
    default: () => ({
      toastRole: 'alert',
      closeButtonLabel: 'close',
    }),
  },
  rtl: Boolean as PropType<boolean>,
  dark: Boolean as PropType<boolean>,
  eventBus: {
    type: Object as PropType<Required<Pick<PluginOptions, 'eventBus'>>['eventBus']>,
    required: true,
  },
};

const TOAST_PROPS: RecordPropsDefinition<ToastOptionsType> = {
  id: {
    type: [String, Number] as PropType<ToastID>,
    required: true,
  },
  type: COMMON_PROPS.type,
  content: {
    type: [String, Object, Function] as PropType<ToastContent>,
    required: true,
  },
  onClick: Function as PropType<NonNullable<ToastOptions['onClick']>>,
  onClose: Function as PropType<NonNullable<ToastOptions['onClose']>>,
};

const CONTAINER_PROPS: RecordPropsDefinition<PluginOptionsType> = {
  container: {
    type: [HTMLElement, Function] as PropType<NonNullable<PluginOptions['container']>>,
    default: () => document.body,
  },
  newestOnTop: COMMON_PROPS.trueBoolean,
  maxToasts: {
    type: Number as PropType<number>,
    default: 20,
  },
  transition: TRANSITION_PROPS.transition,
  transitionDuration: TRANSITION_PROPS.transitionDuration,
  toastDefaults: Object as PropType<NonNullable<PluginOptions['toastDefaults']>>,
  containerClassName: COMMON_PROPS.classNames,
  onMounted: Function as PropType<NonNullable<PluginOptions['onMounted']>>,
};

export { COMMON_PROPS, TRANSITION_PROPS, PROGRESS_BAR_PROPS, CLOSE_BUTTON_PROPS, CORE_TOAST_PROPS, TOAST_PROPS, CONTAINER_PROPS };
