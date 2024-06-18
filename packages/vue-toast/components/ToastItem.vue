<template>
  <div
    :class="classes"
    :style="draggableStyle"
    @click="clickHandler"
    @mouseenter="hoverPause"
    @mouseleave="hoverPlay">
    <div
      :role="toastRole"
      :class="bodyClasses">
      <template v-if="typeof content === 'string'">
        {{ content }}
      </template>
      <component
        :is="vueComponentsFromContent"
        v-else
        :toast-id="id"
        v-bind="componentData.props"
        v-on="componentData.listeners"
        @close-toast="closeToast" />
    </div>
    <close-button
      v-if="!!closeButton"
      :component="closeButton"
      :class-names="closeButtonClassName"
      :show-on-hover="showCloseButtonOnHover"
      :aria-label="accessibility?.closeButtonLabel"
      @click.stop="closeToast" />
    <progress-bar
      v-if="timeout"
      :is-running="isRunning"
      :hide-progress-bar="hideProgressBar"
      :timeout="timeout"
      @close-toast="timeoutHandler" />
  </div>
</template>

<script lang="ts">
import { isUndefined } from 'lodash';
import { defineComponent } from 'vue';

import { CORE_TOAST_PROPS, EVENTS, TOAST_PROPS, VT_NAMESPACE } from '../constants';
import { ToastComponent } from '../types';
import { getVueComponentFromObj, getX, getY, isDOMRect, isString, removeElement } from '../utils';
import CloseButton from './CloseButton.vue';
import ProgressBar from './ProgressBar.vue';

export default defineComponent({
  components: {
    CloseButton,
    ProgressBar,
  },
  inheritAttrs: true,
  props: { ...CORE_TOAST_PROPS, ...TOAST_PROPS },
  data() {
    return {
      isRunning: true,
      disableTransitions: false,
      beingDragged: false,
      dragStart: 0,
      dragPos: { x: 0, y: 0 } as { x: number; y: number },
      dragRect: {} as DOMRect | Record<string, unknown>,
    };
  },
  computed: {
    classes(): string[] {
      const classes = [`${VT_NAMESPACE}__toast`, `${VT_NAMESPACE}__toast--${this.type}`, `${this.position}`].concat(
        Array.isArray(this.toastClassName) ? this.toastClassName : [this.toastClassName ?? ''],
      );

      if (this.disableTransitions) {
        classes.push('disable-transition');
      }

      if (this.rtl) {
        classes.push(`${VT_NAMESPACE}__toast--rtl`);
      }

      if (this.dark) {
        classes.push(`${VT_NAMESPACE}__toast--dark`);
      }

      return classes;
    },

    bodyClasses(): string[] {
      const classes = [`${VT_NAMESPACE}__toast-${isString(this.content) ? 'body' : 'component-body'}`].concat(
        Array.isArray(this.bodyClassName) ? this.bodyClassName : [this.bodyClassName ?? ''],
      );
      return classes;
    },

    dragDelta(): number {
      return this.beingDragged ? this.dragPos.x - this.dragStart : 0;
    },

    removalDistance(): number {
      if (isDOMRect(this.dragRect) && !isUndefined(this.draggablePercent)) {
        return (this.dragRect.right - this.dragRect.left) * this.draggablePercent;
      }

      return 0;
    },

    draggableStyle(): {
      transition?: string;
      opacity?: number;
      transform?: string;
    } {
      if (this.dragStart === this.dragPos.x) {
        return {};
      }

      if (this.beingDragged) {
        return {
          transform: `translateX(${this.dragDelta}px)`,
          opacity: 1 - Math.abs(this.dragDelta / this.removalDistance),
        };
      }

      return {
        transition: 'transform 0.2s, opacity 0.2s',
        transform: 'translateX(0)',
        opacity: 1,
      };
    },
    toastRole() {
      if (!this.accessibility?.toastRole) {
        return 'alert';
      }

      return this.accessibility.toastRole;
    },

    vueComponentsFromContent() {
      return this.getVueComponentFromObj(this.content!);
    },
    componentData() {
      if (!this.content || typeof this.content === 'string') {
        return {};
      }

      const { props, listeners } = this.content as ToastComponent;
      return {
        props,
        listeners,
      };
    },
  },
  mounted() {
    if (this.draggable) {
      this.draggableSetup();
    }

    if (this.pauseOnFocusLoss) {
      this.focusSetup();
    }
  },
  beforeDestroy() {
    if (this.draggable) {
      this.draggableCleanup();
    }

    if (this.pauseOnFocusLoss) {
      this.focusCleanup();
    }
  },

  destroyed() {
    setTimeout(() => {
      removeElement(this.$el);
    }, 1000);
  },
  methods: {
    getVueComponentFromObj,
    closeToast() {
      this.eventBus!.$emit(EVENTS.DISMISS, this.id);
    },
    clickHandler() {
      if (this.onClick) {
        this.onClick(this.closeToast);
      }

      if (this.closeOnClick) {
        if (!this.beingDragged || this.dragStart === this.dragPos.x) {
          this.closeToast();
        }
      }
    },
    timeoutHandler() {
      this.closeToast();
    },
    hoverPause() {
      if (this.pauseOnHover) {
        this.isRunning = false;
      }
    },
    hoverPlay() {
      if (this.pauseOnHover) {
        this.isRunning = true;
      }
    },
    focusPause() {
      this.isRunning = false;
    },
    focusPlay() {
      this.isRunning = true;
    },
    focusSetup() {
      window.addEventListener('blur', this.focusPause);
      window.addEventListener('focus', this.focusPlay);
    },
    focusCleanup() {
      window.removeEventListener('blur', this.focusPause);
      window.removeEventListener('focus', this.focusPlay);
    },
    onDragStart(event: TouchEvent | MouseEvent) {
      this.beingDragged = true;
      this.dragPos = { x: getX(event), y: getY(event) };
      this.dragStart = getX(event);
      this.dragRect = this.$el.getBoundingClientRect();
    },
    onDragMove(event: TouchEvent | MouseEvent) {
      if (this.beingDragged) {
        event.preventDefault();

        if (this.isRunning) {
          this.isRunning = false;
        }

        this.dragPos = { x: getX(event), y: getY(event) };
      }
    },
    onDragEnd() {
      if (this.beingDragged) {
        if (Math.abs(this.dragDelta) >= this.removalDistance) {
          this.disableTransitions = true;
          this.$nextTick(() => this.closeToast());
        } else {
          setTimeout(() => {
            this.beingDragged = false;

            if (
              isDOMRect(this.dragRect) &&
              this.pauseOnHover &&
              this.dragRect.bottom >= this.dragPos.y &&
              this.dragPos.y >= this.dragRect.top &&
              this.dragRect.left <= this.dragPos.x &&
              this.dragPos.x <= this.dragRect.right
            ) {
              this.isRunning = false;
            } else {
              this.isRunning = true;
            }
          });
        }
      }
    },
    draggableSetup() {
      const element = this.$el as HTMLElement;
      element.addEventListener('touchstart', this.onDragStart, {
        passive: true,
      });
      element.addEventListener('mousedown', this.onDragStart);
      window.addEventListener('touchmove', this.onDragMove, { passive: false });
      window.addEventListener('mousemove', this.onDragMove);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('mouseup', this.onDragEnd);
    },
    draggableCleanup() {
      const element = this.$el as HTMLElement;
      element.removeEventListener('touchstart', this.onDragStart);
      element.removeEventListener('mousedown', this.onDragStart);
      window.removeEventListener('touchmove', this.onDragMove);
      window.removeEventListener('mousemove', this.onDragMove);
      window.removeEventListener('touchend', this.onDragEnd);
      window.removeEventListener('mouseup', this.onDragEnd);
    },
  },
});
</script>
