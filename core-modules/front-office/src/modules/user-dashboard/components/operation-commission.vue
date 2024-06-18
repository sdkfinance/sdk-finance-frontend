<template>
  <div class="operation-commission">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="items">
      <div class="operation-commission__label">
        <slot :name="`label-${row}`" />
      </div>
      <div class="operation-commission__value">
        <slot :name="`value-${row}`" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'operation-commission',
})
export default class OperationCommission extends Vue {
  @Prop({ default: 1 }) readonly rows!: number;
}
</script>

<style lang="scss">
.operation-commission {
  @apply bg-gray-350 py-24 px-32;

  &__label {
    @apply text-sm text-blue-500;
  }

  &__value {
    @apply text-base font-medium mb-8;
  }
}
</style>
