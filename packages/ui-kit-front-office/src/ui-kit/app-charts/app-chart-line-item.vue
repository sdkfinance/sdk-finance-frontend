<template>
  <div
    ref="chartItem"
    :key="`chartItem_${percent}`"
    class="app-chart__item"
    :class="{ 'app-chart__item--hidden': percent === 0 }"
    :style="{ width: percent + '%' }">
    <app-popover
      v-if="isDataHidden"
      :width="115">
      <template #action>
        <div
          class="app-chart__line"
          :class="{ 'app-chart__line--hidden': !isMounted }"
          :style="{ color }" />
      </template>
      <slot />
    </app-popover>
    <div v-else>
      <div
        class="app-chart__line"
        :class="{ 'app-chart__line--hidden': !isMounted }"
        :style="{ color }" />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AppPopover } from '../../ui-framework';

const ANIMATION_DELAY: number = 500;

export default defineComponent({
  name: 'AppChartLineItem',
  components: {
    AppPopover,
  },
  props: {
    color: { type: String, default: '#000' },
    percent: { type: [Number, String], default: '0' },
  },
  data() {
    const isMounted: boolean = false;
    const isDataHidden: boolean = false;

    return {
      isDataHidden,
      isMounted,
    };
  },
  watch: {
    chart: [{ immediate: true, handler: 'onUpdate' }],
  },
  methods: {
    async setHidden(): Promise<void> {
      const chartItem = this.$refs?.chartItem as HTMLElement;
      this.isDataHidden = chartItem?.offsetWidth <= 100;
    },
    async onUpdate(): Promise<void> {
      this.isMounted = false;
      this.isDataHidden = false;
      await this.$nextTick();
      await this.setHidden();
      setTimeout(() => {
        this.isMounted = true;
      }, ANIMATION_DELAY);
    },
  },
});
</script>

<style lang="scss">
.app-chart {
  &__item {
    @apply flex flex-col mr-4;

    &--hidden {
      @apply hidden mr-0;
    }

    min-width: 4px;

    &:last-of-type {
      @apply mr-0;
    }

    &:hover .app-chart__line::after {
      @apply h-10;

      transform: translateY(-25%);
    }
  }

  &__line {
    @apply w-full h-4 relative mb-8 cursor-pointer bg-blue-200;

    &::after {
      @apply block w-full h-4 rounded-xl;
      @apply absolute inset-0 w-full bg-current;

      content: '';
      transition:
        height 0.3s,
        transform 0.3s,
        width 1s;
    }

    &--hidden::after {
      @apply w-0 #{!important};
    }
  }
}
</style>
