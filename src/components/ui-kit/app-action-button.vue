<template>
  <button
    role="button"
    class="app-action-button"
    :class="{disabled: disabled}"
    :style="actionStyles"
    @click="$emit('click')">
    <div :class="['app-action-button__icon', icon]"/>
    <div class="app-action-button__title">
      {{ $t(title) }}
    </div>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppActionButton extends Vue {

  @Prop({ type: String, default: '' }) readonly icon!: string;

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: Number, default: 1 }) readonly length!: number;

  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;

  protected get actionStyles(): string {
    return `width: ${100 / this.length}%`;
  }

}
</script>

<style lang="scss">
.app-action-button {
  @apply flex flex-col justify-start items-center justify-start h-full max-w-135 py-10;
  @apply cursor-pointer hover:bg-blue-200 rounded-lg box-border;
  @apply transition transition-colors duration-200 ease-linear;

  &.disabled {
    @apply cursor-not-allowed pointer-events-none opacity-50;
  }

  &:hover {
    box-shadow: 0 4px 16px #f0f7fd;
  }

  &__icon {
    @apply text-sm text-blue-accent mb-12;
  }

  &__title {
    @apply font-medium text-sm text-center text-blue-accent;
  }
}
</style>
