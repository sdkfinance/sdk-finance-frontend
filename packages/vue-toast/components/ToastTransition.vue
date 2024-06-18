<template>
  <transition-group
    tag="div"
    :enter-active-class="enterActiveClass"
    :move-class="moveClass"
    :leave-active-class="leaveActiveClass"
    @leave="leave"
    @before-enter="beforeEnter"
    @before-leave="beforeLeave"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <slot />
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { TRANSITION_PROPS } from '../constants';

export default defineComponent({
  inheritAttrs: false,
  props: TRANSITION_PROPS,
  computed: {
    enterActiveClass() {
      return typeof this.transition === 'string' ? `${this.transition}-enter-active` : this.transition.enter;
    },
    moveClass() {
      return typeof this.transition === 'string' ? `${this.transition}-move` : this.transition;
    },
    leaveActiveClass() {
      return typeof this.transition === 'string' ? `${this.transition}-leave-active` : this.transition.leave;
    },
  },
  methods: {
    beforeEnter(el: HTMLElement) {
      const enterDuration = typeof this.transitionDuration === 'number' ? this.transitionDuration : this.transitionDuration!.enter;
      el.style.animationDuration = `${enterDuration}ms`;
      el.style.animationFillMode = 'both';
      this.$emit('before-enter', el);
    },
    afterEnter(el: HTMLElement) {
      this.cleanUpStyles(el);
      this.$emit('after-enter', el);
    },
    afterLeave(el: HTMLElement) {
      this.cleanUpStyles(el);
      this.$emit('after-leave', el);
    },
    beforeLeave(el: HTMLElement) {
      const leaveDuration = typeof this.transitionDuration === 'number' ? this.transitionDuration : this.transitionDuration!.leave;
      el.style.animationDuration = `${leaveDuration}ms`;
      el.style.animationFillMode = 'both';
      this.$emit('before-leave', el);
    },
    leave(el: HTMLElement, done: Function) {
      this.setAbsolutePosition(el);
      this.$emit('leave', el, done);
    },
    setAbsolutePosition(el: HTMLElement) {
      el.style.left = `${el.offsetLeft}px`;
      el.style.top = `${el.offsetTop}px`;
      el.style.width = getComputedStyle(el).width;
      el.style.height = getComputedStyle(el).height;
      el.style.position = 'absolute';
    },
    cleanUpStyles(el: HTMLElement) {
      el.style.animationFillMode = '';
      el.style.animationDuration = '';
    },
  },
});
</script>
