<template>
  <div class="switch-block">
    <h3 class="switch-block__title">
      {{ $t(title) }}
      <slot name="help" />
    </h3>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SwitchBlock extends Vue {
  @Prop({ default: '', type: String }) private title!: string;
}
</script>

<style lang="scss">
.switch-block {
  @apply mt-[25px] mb-[20px];

  &__title {
    @apply flex items-center font-semibold text-[12px] leading-[15px] mt-0 mb-[10px];
  }

  .app-switch {
    @apply mb-[5px];
  }
}
</style>
