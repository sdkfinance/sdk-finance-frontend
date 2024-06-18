<template>
  <div :class="cpClass">
    <div :class="trackClass">
      <div
        :class="thumbClass"
        :style="style" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { PROGRESS_BAR_PROPS, VT_NAMESPACE } from '../constants';

export default defineComponent({
  props: PROGRESS_BAR_PROPS,
  data() {
    return {
      hasClass: true,
    };
  },
  computed: {
    style(): {
      animationDuration: string;
      animationPlayState: string;
      opacity: number;
    } {
      return {
        animationDuration: `${this.timeout}ms`,
        animationPlayState: this.isRunning ? 'running' : 'paused',
        opacity: this.hideProgressBar ? 0 : 1,
      };
    },

    cpClass(): string {
      return this.hasClass ? `${VT_NAMESPACE}__progress-bar` : '';
    },
    trackClass(): string {
      return `${VT_NAMESPACE}__progress-bar-track`;
    },
    thumbClass(): string {
      return `${VT_NAMESPACE}__progress-bar-thumb`;
    },
  },

  watch: {
    timeout() {
      this.hasClass = false;
      this.$nextTick(() => {
        this.hasClass = true;
      });
    },
  },

  mounted() {
    this.$el.addEventListener('animationend', this.animationEnded);
  },

  beforeDestroy() {
    this.$el.removeEventListener('animationend', this.animationEnded);
  },

  methods: {
    animationEnded() {
      this.$emit('close-toast');
    },
  },
});
</script>
