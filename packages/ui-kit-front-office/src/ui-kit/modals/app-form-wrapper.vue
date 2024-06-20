<template>
  <div
    class="app-form-wrapper"
    :class="classList">
    <div
      v-show="$slots.title"
      class="app-form-wrapper__title">
      <slot name="title" />
    </div>
    <div class="app-form-wrapper__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type IPlainObject = Record<string, any>;
export default defineComponent({
  name: 'AppFormWrapper',
  props: {
    isButtonsAlignLeft: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    classList(): IPlainObject {
      return {
        'app-form-wrapper--button-left': this.isButtonsAlignLeft,
      };
    },
  },
});
</script>

<style lang="scss">
.app-form-wrapper {
  @apply flex flex-col mt-50 mb-40 px-14;

  &__title {
    @apply font-semibold text-2xl text-center mb-65;
  }

  &__body {
    form {
      @apply w-full;
    }

    .app-form-item__wrapper {
      @apply mb-32;
    }

    .app-button {
      @apply ml-auto mr-auto;
    }
  }
}

.app-form-wrapper--button-left {
  button {
    margin-left: 0;

    @apply mr-auto;
  }
}
</style>
