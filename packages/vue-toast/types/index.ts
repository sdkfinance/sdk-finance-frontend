import Vue, { Component } from 'vue';
import { CombinedVueInstance, VueConstructor } from 'vue/types/vue';

import { TPosition, TType } from '../constants';

/**
 * Utility type to declare an extended Vue constructor
 */
export type VueClass<V extends Vue> = (new (...args: unknown[]) => V) & typeof Vue;

export type ContainerCallback = () => HTMLElement | Promise<HTMLElement>;

export type ToastID = string | number;

export interface CommonOptions {
  /**
   *  Position of the toast on the screen.
   *
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */
  position?: TPosition;
  /**
   *  Position of the toast on the screen.
   *
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */
  draggable?: boolean;
  /**
   *  By how much of the toast width in percent (0 to 1) it must be dragged before being dismissed.
   */
  draggablePercent?: number;
  /**
   *  Whether or not the toast is paused when the window loses focus.
   */
  pauseOnFocusLoss?: boolean;
  /**
   *  Whether or not the toast is paused when it is hovered by the mouse.
   */
  pauseOnHover?: boolean;
  /**
   *  Whether or not the toast is closed when clicked.
   */
  closeOnClick?: boolean;
  /**
   * How many milliseconds for the toast to be auto dismissed, or false to disable.
   */
  timeout?: number | false;
  /**
   *  Custom classes applied to the toast.
   */
  toastClassName?: string | string[];
  /**
   *  Custom classes applied to the body of the toast.
   */
  bodyClassName?: string | string[];
  /**
   * Whether or not the progress bar is hidden.
   */
  hideProgressBar?: boolean;
  /**
   * Only shows the close button when hovering the toast
   */
  showCloseButtonOnHover?: boolean;
  /**
   * Custom close button component
   *
   * Alternative close button component to be displayed in toasts
   */
  closeButton?: false | keyof HTMLElementTagNameMap | Component | JSX.Element;
  /**
   *  Custom classes applied to the close button of the toast.
   */
  closeButtonClassName?: string | string[];
  /**
   * Accessibility options
   */
  accessibility?: {
    /**
     * Toast accessibility role
     *
     * Accessibility option "role" for screen readers. Defaults to "alert".
     */
    toastRole?: string;
    /**
     * Close button label
     *
     * Accessibility option of the closeButton's "label" for screen readers. Defaults to "close".
     */
    closeButtonLabel?: string;
  };
  /**
   * Right-to-Left support.
   *
   * If true, switches the toast contents from right to left. Defaults to false.
   */
  rtl?: boolean;
  /*
   * Whether or not the toast is dark
   */
  dark?: boolean;
  /**
   * Vue instance used to pass events across the interface
   *
   * Created by default, but you can use your own if you want
   */
  eventBus?: InstanceType<VueConstructor>;
}

export interface ToastOptions extends CommonOptions {
  /**
   *  ID of the toast.
   */
  id?: ToastID;
  /**
   *  Type of the toast.
   *
   *  Can be any of `success error default info warning`
   */
  type?: TType;
  /**
   * Callback executed when the toast is clicked.
   *
   *  A closeToast callback is passed as argument to onClick when it is called.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: (closeToast: Function) => void;
  /**
   *  Callback executed when the toast is closed.
   */
  onClose?: () => void;
}

export interface PluginOptions extends CommonOptions {
  /**
   * Container where the toasts are mounted.
   */
  container?: HTMLElement | ContainerCallback;
  /**
   *  Whether or not the newest toasts are placed on the top of the stack.
   */
  newestOnTop?: boolean;
  /**
   *  Maximum number of toasts on each stack at a time. Overflows wait until older toasts are dismissed to appear.
   */
  maxToasts?: number;
  /**
   *  Name of the Vue Transition or object with classes to use.
   *
   *  Only `enter-active`, `leave-active` and `move` are applied.
   */
  transition?: string | Record<'enter' | 'leave' | 'move', string>;
  /**
   * Duration of the transition.
   *
   * Can either be a positive integer for both enter and leave, or an object of shape `{enter: number, leave: number}`.
   */
  transitionDuration?: number | Record<'enter' | 'leave', number>;
  /**
   *  Toast's defaults object for configuring default toast options for each toast type.
   *
   *  Possible object properties can be any of `success error default info warning`
   */
  toastDefaults?: Partial<Record<TType, ToastOptions>>;
  /**
   * Extra CSS class or classes added to each of the Toast containers.
   *
   * Keep in mind that there is one container for each possible toast position.
   */
  containerClassName?: string | string[];
  /**
   * Callback executed when the toast container is mounted.
   *
   * Receives the Container vue instance as a parameter.
   */
  onMounted?: (containerComponent: CombinedVueInstance<Record<never, unknown> & Vue, unknown, unknown, unknown, Record<never, unknown>>) => void;
}

export interface ToastComponent {
  /**
   * Component that will be rendered.
   */
  component: ToastContent;
  /**
   * `propName: propValue` pairs of props that will be passed to the component.
   *
   * __These are not reactive__
   */
  props?: Record<string, unknown>;
  /**
   * `eventName: eventHandler` pairs of events that the component can emit.
   */
  listeners?: { [listenerEvent: string]: Function };
}

export type RenderableToastContent = string | Component;

export type ToastContent = RenderableToastContent | JSX.Element | ToastComponent;

export type ToastOptionsAndContent = ToastOptions & { content?: ToastContent };
export type ToastOptionsAndRequiredContent = ToastOptions & {
  content: ToastContent;
};
