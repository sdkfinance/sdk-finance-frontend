<template>
  <div class="app-buttons-mobile">
    <div class="app-buttons-mobile__visible">
      <slot
        name="mobile-visible"/>
      <app-button
        class="app-buttons-mobile__action"
        @click="toggleButtons">
        <i
          class="icon"
          :class="isButtonsVisible ? 'icon-close' : 'icon-more' "/>
      </app-button>
    </div>
    <div
      class="app-buttons-mobile__hidden"
      :class="{'is-show': isButtonsVisible}">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: {
    AppButton,
  },
})
export default class AppButtonsMobile extends Vue {

  protected isButtonsVisible: boolean = false;

  protected toggleButtons(): void {
    this.isButtonsVisible = !this.isButtonsVisible;
  }

}
</script>

<style lang="scss">
.app-buttons-mobile {
  @apply flex items-center flex-col sm:flex-row;

  .btn + .btn {
    @apply ml-10;
  }

  &__action {
    @apply sm:hidden #{!important};
    @apply flex-shrink-0 w-42 pl-0 pr-0;

    .icon {
      @apply text-sm align-middle leading-3;
    }
  }

  &__visible {
    @apply w-full sm:w-auto flex;

    & > .btn:first-child {
      @apply flex-grow;
    }
  }

  &__hidden {
    @apply
      h-0
      opacity-0
      sm:opacity-100
      sm:h-auto
      w-full
      flex-col
      sm:w-auto
      sm:flex
      sm:flex-row
      items-center
      transition
      transition-opacity;

    & .btn {
      @apply flex-grow mt-16 ml-0 w-full sm:mt-0 sm:ml-10 sm:w-auto;
    }

    &.is-show {
      @apply h-auto opacity-100;
    }
  }
}
</style>
