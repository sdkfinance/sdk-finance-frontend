<template>
  <div
    ref="chartItem"
    :key="`chartItem_${percent}`"
    class="app-chart__item"
    :class="{'app-chart__item--hidden': percent === 0}"
    :style="{width: percent + '%'}">
    <app-popover
      v-if="isDataHidden"
      :width="115">
      <template #action>
        <div
          class="app-chart__line"
          :class="{'app-chart__line--hidden': !isMounted}"
          :style="{ color }"/>
      </template>
      <slot/>
    </app-popover>
    <div v-else>
      <div
        class="app-chart__line"
        :class="{'app-chart__line--hidden': !isMounted}"
        :style="{ color }"/>
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';

import AppPopover from '@/components/ui-framework/app-popover.vue';

const ANIMATION_DELAY: number = 500;

@Component({
  components: {
    AppPopover,
  },
})
export default class AppChartLineItem extends Vue {

  @Prop({ type: String, default: '#000' }) readonly color!: string;

  @Prop({ type: [Number, String], default: '0' }) readonly percent!: number | string;

  protected isDataHidden: boolean = false;

  protected isMounted: boolean = false;

  protected async setHidden(): Promise<void> {
    const chartItem = this.$refs?.chartItem as HTMLElement;
    this.isDataHidden = chartItem?.offsetWidth <= 100;
  }

  @Watch('chart', { immediate: true })
  protected async onUpdate(): Promise<void> {
    this.isMounted = false;
    this.isDataHidden = false;
    await this.$nextTick();
    await this.setHidden();
    setTimeout(() => {
      this.isMounted = true;
    }, ANIMATION_DELAY);

  }

}
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

      content: "";
      transition: height 0.3s, transform 0.3s, width 1s;
    }

    &--hidden::after {
      @apply w-0 #{!important};
    }
  }
}
</style>
