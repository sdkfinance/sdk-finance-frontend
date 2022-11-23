<template>
  <component
    :is="to ? 'router-link' : 'div'"
    class="app-smart-card"
    :to="to">
    <div class="app-smart-card__header">
      <div class="app-smart-card__title">
        {{ title }}
      </div>
      <img
        class="app-smart-card__icon"
        src="/images/icons/masterpass.svg"
        alt="">
    </div>
    <div class="app-smart-card__subtitle">
      {{ maskedCardNumber }}
    </div>
    <slot/>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

import AppCardProgress from '@/components/ui-kit/app-card-progress.vue';
import AppProgressBar from '@/components/ui-kit/app-progress-bar.vue';
import { getDisplayCardNumber } from '@/modules/user-dashboard/utils/getDisplayCardNumber';

@Component({
  components: {
    AppCardProgress,
    AppProgressBar,
  },
})
export default class AppSmartCard extends Vue {

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: String, default: '' }) readonly cardNumber!: string;

  @Prop({ type: Object, default: null }) readonly to!: RawLocation;

  protected get maskedCardNumber(): string {
    return getDisplayCardNumber(this.cardNumber);
  }

}
</script>

<style lang="scss">
.app-smart-card {
  box-shadow: 0 4px 12px rgb(161 182 198 / 20%);

  @apply w-full md:w-324 lg:w-268 h-148 h-148 transition duration-500 ease-in-out cursor-pointer rounded-lg bg-white py-16
    px-20;

  &__header {
    @apply flex justify-between items-center ;
  }

  &__title {
    @apply font-medium text-base text-gray-500;
  }

  &__subtitle {
    @apply text-blue-500 text-sm font-medium mt-4 mb-20;
  }
}
</style>
