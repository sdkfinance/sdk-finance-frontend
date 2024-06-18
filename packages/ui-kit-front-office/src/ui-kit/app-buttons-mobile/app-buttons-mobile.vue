<template>
  <div class="app-buttons-mobile app-buttons-mobile--front-office">
    <div class="app-buttons-mobile__visible">
      <slot name="mobile-visible" />
      <app-button
        class="app-buttons-mobile__action"
        @click="toggleButtons">
        <i
          class="icon"
          :class="isButtonsVisible ? 'icon-close' : 'icon-more'" />
      </app-button>
    </div>
    <div
      class="app-buttons-mobile__hidden"
      :class="{ 'is-show': isButtonsVisible }">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AppButton } from '../../ui-framework/app-button';

export default defineComponent({
  name: 'AppButtonsMobile',
  components: {
    AppButton,
  },
  data() {
    const isButtonsVisible: boolean = false;

    return {
      isButtonsVisible,
    };
  },
  methods: {
    toggleButtons(): void {
      this.isButtonsVisible = !this.isButtonsVisible;
    },
  },
});
</script>

<style lang="scss">
.app-buttons-mobile--front-office {
  @apply flex items-center flex-col gap-[1rem] sm:flex-row;

  .app-button {
    @apply ml-0;
  }

  .app-buttons-mobile {
    &__action {
      @apply sm:hidden #{!important};
      @apply flex-shrink-0 w-42 pl-0 pr-0;

      .icon {
        @apply text-sm align-middle leading-3;
      }
    }

    &__visible {
      @apply w-full sm:w-auto flex gap-x-[0.625rem];

      & > .app-button:first-child {
        @apply flex-grow;
      }
    }

    &__hidden {
      @apply h-0
      hidden
      opacity-0
      sm:opacity-100
      sm:h-auto
      w-full
      flex-col
      sm:w-auto
      sm:flex
      sm:flex-row
      items-center
      transition-opacity
      gap-y-[1rem]
      gap-x-[0.625rem];

      & .app-button {
        @apply flex-grow ml-0 w-full sm:w-auto;
      }

      &.is-show {
        @apply flex h-auto opacity-100;
      }
    }
  }
}
</style>
