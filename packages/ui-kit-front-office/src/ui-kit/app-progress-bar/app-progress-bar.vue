<template>
  <div class="progress">
    <div class="progress__container">
      <div class="progress__bar">
        <span
          class="progress__indicator"
          :class="[{ 'zero-width': !isMounted }]"
          :style="{ width: value + '%', backgroundColor: barColor }" />
      </div>
    </div>
    <div
      v-if="isShowPercents"
      class="progress__percent">
      {{ `${value}%` }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppProgressBar',
  props: {
    value: { type: [String, Number], default: '0' },
    isShowPercents: { type: Boolean, default: true },
    barColor: { type: String, default: '#6258BA' },
  },
  data() {
    const isMounted: boolean = false;

    return {
      isMounted,
    };
  },
  async mounted(): Promise<void> {
    await this.$nextTick();
    this.isMounted = true;
  },
});
</script>

<style lang="scss">
.zero-width {
  @apply w-0 #{!important};
}

.progress {
  @apply w-full h-24 flex items-center;

  &__container {
    @apply w-full;
  }

  &__bar {
    @apply h-4 relative box-content bg-blue-100 rounded;
  }

  &__indicator {
    @apply relative rounded overflow-hidden h-full block transition-all duration-1000 ease-out;
  }

  &__percent {
    @apply text-base font-semibold w-36 ml-28 text-gray-400 whitespace-nowrap;
  }
}
</style>
