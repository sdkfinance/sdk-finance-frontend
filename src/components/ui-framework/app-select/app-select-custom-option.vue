<template>
  <div class="app-select-custom-option">
    <div class="app-select-custom-option__box">
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          alt=""
          class="app-select-custom-option__image">
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
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppSelectCustomOption extends Vue {

  @Prop({ type: String, default: '' }) readonly image!: string;

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: String, default: '' }) readonly additional!: string;

}
</script>

<style lang="scss">
.app-select-custom-option {
  @apply flex items-center justify-between h-full font-medium text-base;

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
