<template>
  <div
    class="app-operation-image"
    :style="{backgroundColor}"
    :class="operationClasses">
    <div class="app-operation-image__wrapper">
      <slot>
        <img
          v-if="image"
          :src="image"
          :alt="alt">

        <p v-else-if="initials">
          {{ initials }}
        </p>
      </slot>
    </div>

    <div
      v-if="hasError"
      class="app-operation-image__icon">
      <i class="icon-plus icon"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppOperationImage extends Vue {

  @Prop({ type: String, default: '' }) readonly image!: string;

  @Prop({ type: String, default: '' }) readonly alt!: string;

  @Prop({ type: String, default: 'md' }) readonly size!: string;

  @Prop({ type: String, default: '#0D2C50' }) readonly backgroundColor!: string;

  @Prop({ type: String, default: '' }) readonly textColor!: string;

  @Prop({ type: String, default: '' }) readonly initials!: string;

  @Prop({ type: Boolean, default: false }) readonly hasError!: boolean;

  @Prop({ type: Boolean, default: false }) readonly hasShadow!: boolean;

  protected get operationClasses(): string[] {
    const smallSize = 'w-32 h-32';

    return [
      this.textColor ? `text-${this.textColor}` : '',
      this.size === 'lg' ? `${smallSize} md:w-64 md:h-64` : `${smallSize} md:w-42 md:h-42`,
      this.hasShadow ? 'app-operation-image--shadow' : '',
    ];
  }

}
</script>

<style lang="scss">
.app-operation-image {
  @apply bg-transparent relative mr-16 rounded-lg flex-shrink-0;

  &--shadow {
    box-shadow: 0 5px 10px rgb(13 44 80 / 20%);
  }

  &__wrapper {
    @apply h-full w-full overflow-hidden rounded-lg flex items-center justify-center p-3;
  }

  &__icon {
    @apply absolute -right-10 bottom-0 z-1 text-white text-2xs bg-red-main rounded-full border-2 border-white;
    @apply w-20 h-20 flex items-center justify-center transform rotate-45;

    i {
      @apply font-black;
    }
  }
}

</style>
