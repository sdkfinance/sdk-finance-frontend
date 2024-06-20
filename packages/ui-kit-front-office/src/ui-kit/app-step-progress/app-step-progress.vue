<template>
  <div class="app-step-progress">
    <template v-for="step in totalSteps">
      <div
        :key="`app-step-${step}`"
        class="app-step-progress__step">
        <div
          class="app-step-progress__step-label"
          :class="{ 'app-step-progress__step-label--active': currentStep === step }">
          {{ step }}
        </div>
        <div class="app-step-progress__step-title">
          <slot :name="`title-${step}`" />
        </div>
      </div>
      <div
        v-if="step < totalSteps"
        :key="`app-separator-${step}`"
        class="app-step-progress__separator" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppStepProgress',
  props: {
    currentStep: { type: Number, default: 1 },
    totalSteps: { type: Number, default: 1 },
  },
});
</script>

<style lang="scss">
.app-step-progress {
  @apply flex items-center justify-between;

  &__separator {
    @apply flex flex-grow h-px bg-blue-400 mb-30;
  }

  &__step {
    @apply flex flex-col items-center flex-shrink-0 relative px-16 pb-20;

    &-label {
      @apply w-24 h-24 flex items-center justify-center rounded-full transition;
      @apply bg-gray-300 text-gray-400 text-sm mb-8 font-semibold leading-none;

      &--active {
        @apply bg-blue-300 text-primary;
      }
    }

    &-title {
      font-variant: small-caps;

      @apply absolute bottom-0 text-blue-600 text-sm text-center font-semibold whitespace-nowrap;
    }
  }
}
</style>
