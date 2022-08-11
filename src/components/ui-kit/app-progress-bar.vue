<template>
  <div class="progress">
    <div
      class="progress__container">
      <div class="progress__bar">
        <span
          class="progress__indicator"
          :class="[{ 'zero-width': !isMounted }]"
          :style="{ width: value + '%', backgroundColor: barColor }"/>
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
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';

@Component
export default class AppProgressBar extends Vue {

  @Prop({ type: [String, Number], default: '0' }) protected value!: string|number;

  @Prop({ type: Boolean, default: true }) readonly isShowPercents!: boolean;

  @Prop({ type: String, default: '#6258BA' }) readonly barColor!: string;

  protected isMounted: boolean = false;

  protected async mounted(): Promise<void> {
    await this.$nextTick();
    this.isMounted = true;
  }

}
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
