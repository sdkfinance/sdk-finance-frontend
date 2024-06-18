<template>
  <div class="app-select-custom-option">
    <div class="app-select-custom-option__box">
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          alt=""
          class="app-select-custom-option__image" />
      </slot>
      <div class="app-select-custom-option__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
    </div>
    <div>
      <slot name="additional">
        {{ additional }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppSelectCustomOption',
  props: {
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    additional: { type: String, default: '' },
  },
});
</script>

<style lang="scss">
.app-select-custom-option {
  @apply flex items-center justify-between h-full w-full font-medium text-base;

  &__box {
    @apply flex items-center overflow-hidden w-auto whitespace-nowrap overflow-ellipsis;
  }

  &__title {
    @apply ml-8 pr-20;
  }

  &__image {
    @apply w-18 h-18 inline rounded-round ml-5;
  }
}
</style>
