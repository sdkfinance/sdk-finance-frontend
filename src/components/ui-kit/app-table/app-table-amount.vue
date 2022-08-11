<template>
  <p
    class="app-table-amount"
    :class="classList">
    {{ amount }}
  </p>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AppTableAmount extends Vue {

  @Prop({ default: '', type: String }) readonly amount!: string;

  @Prop({ default: false, type: Boolean }) readonly isBold!: boolean;

  @Prop({ default: 'text-gray-500', type: String }) readonly customClass!: string;

  protected get isTopUp(): boolean {
    return this.amount.startsWith('+');
  }

  protected get classList(): string[] {
    return [
      this.isTopUp ? 'app-table-amount--positive' : '',
      this.isBold ? 'app-table-amount--bold' : '',
      this.customClass ? this.customClass : '',
    ];
  }

}
</script>

<style lang="scss">
.app-table-amount {
  @apply text-lg whitespace-nowrap font-semibold text-right;

  &--positive {
    @apply text-green-status;
  }

  &--bold {
    @apply text-20;
  }
}
</style>
