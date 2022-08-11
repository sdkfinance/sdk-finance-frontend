<template>
  <div
    :class="[...classesList]"
    :style="{ 'padding-top': offsetTop + 'px' }">
    <slot/>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

@Component
export default class AppButtonsGroup extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isVertical!: boolean;

  @Prop({ type: [Number, String], default: 0 }) readonly offsetTop!: number;

  protected get classesList(): any[] {
    return ['app-buttons-group', { 'buttons-group--vertical': this.isVertical }];
  }

}
</script>

<style lang="scss">
  .app-buttons-group {
    @apply ml-auto flex;

    button.btn {
      @apply ml-6;
    }

    &--vertical {
      @apply flex-col;

      button.btn {
        @apply mx-0 mb-16;

        &:last-of-type {
          @apply mb-0;
        }
      }
    }

    &--offset-top {
      @apply mt-26;
    }
  }
</style>
