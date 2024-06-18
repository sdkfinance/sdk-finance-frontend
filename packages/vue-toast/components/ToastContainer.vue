<template>
  <div>
    <div
      v-for="pos in positions"
      :key="pos">
      <toast-transition
        :transition="defaults.transition"
        :transition-duration="defaults.transitionDuration"
        :class="getClasses(pos)">
        <toast-item
          v-for="toast in getPositionToasts(pos)"
          :key="toast.id"
          v-bind="toast" />
      </toast-transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { CONTAINER_PROPS, CORE_TOAST_PROPS, EVENTS, PluginOptionsType, POSITION, TPosition, TRANSITION_PROPS, VT_NAMESPACE } from '../constants';
import { PluginOptions, ToastID, ToastOptionsAndContent, ToastOptionsAndRequiredContent } from '../types';
import { isFunction, isUndefined, removeElement } from '../utils';
import ToastItem from './ToastItem.vue';
import ToastTransition from './ToastTransition.vue';

export default defineComponent({
  components: {
    ToastItem,
    ToastTransition,
  },
  props: { ...CORE_TOAST_PROPS, ...CONTAINER_PROPS, ...TRANSITION_PROPS },
  data() {
    return {
      count: 0,
      positions: Object.values(POSITION) as TPosition[],
      toasts: {} as Record<ToastID, ToastOptionsAndRequiredContent>,
      defaults: {} as PluginOptionsType,
    };
  },
  computed: {
    toastArray(): ToastOptionsAndRequiredContent[] {
      return Object.values(this.toasts);
    },
  },
  beforeMount() {
    this.setup(this.container as PluginOptionsType['container']);
    this.eventBus!.$on(EVENTS.ADD, this.addToast);
    this.eventBus!.$on(EVENTS.CLEAR, this.clearToasts);
    this.eventBus!.$on(EVENTS.DISMISS, this.dismissToast);
    this.eventBus!.$on(EVENTS.UPDATE, this.updateToast);
    this.eventBus!.$on(EVENTS.UPDATE_DEFAULTS, this.updateDefaults);
    this.defaults = this.$props as any;
  },
  methods: {
    async setup(container: PluginOptionsType['container']) {
      if (isFunction(container)) {
        // eslint-disable-next-line no-param-reassign
        container = await container();
      }

      removeElement(this.$el);
      container.appendChild(this.$el);
    },
    setToast(props: ToastOptionsAndRequiredContent) {
      if (!isUndefined(props.id)) {
        this.$set(this.toasts, props.id, props);
      }
    },
    addToast(params: ToastOptionsAndRequiredContent) {
      const defaultsByType = (
        params.type && this.defaults.toastDefaults ? this.defaults.toastDefaults[params.type] : {}
      ) as ToastOptionsAndRequiredContent;

      const props: ToastOptionsAndRequiredContent = {
        ...this.defaults,
        ...defaultsByType,
        ...params,
      };
      this.setToast(props);
    },
    dismissToast(id: ToastID) {
      const toast = this.toasts[id];

      if (!isUndefined(toast) && !isUndefined(toast.onClose)) {
        toast.onClose();
      }

      this.$delete(this.toasts, id);
    },
    clearToasts() {
      Object.keys(this.toasts).forEach((id: ToastID) => {
        this.dismissToast(id);
      });
    },
    getPositionToasts(position: TPosition) {
      const toasts = this.toastArray.filter((toast) => toast.position === position).slice(0, this.defaults.maxToasts);

      return this.defaults.newestOnTop ? toasts.reverse() : toasts;
    },
    updateDefaults(update: PluginOptions) {
      // Update container if changed
      if (!isUndefined(update.container)) {
        this.setup(update.container);
      }

      this.defaults = { ...(this.defaults as any), ...update };
    },
    updateToast({ id, options, create }: { id: ToastID; options: ToastOptionsAndContent; create: boolean }) {
      if (this.toasts[id]) {
        // If a timeout is defined, and is equal to the one before, change it
        // a little so the progressBar is reset
        if (options.timeout && options.timeout === this.toasts[id].timeout) {
          options.timeout += 1;
        }

        this.setToast({ ...this.toasts[id], ...options });
      } else if (create) {
        this.addToast({ id, ...(options as ToastOptionsAndRequiredContent) });
      }
    },
    getClasses(position: TPosition) {
      const classes = [`${VT_NAMESPACE}__container`, position];
      return classes.concat(this.defaults.containerClassName);
    },
  },
});
</script>
