<template>
  <div class="amount-column">
    <strong
      v-if="data.type === 'exchange_transaction'"
      class="amount-column__amount-string amount-column__amount-string--bold">
      (-{{ data.amountFrom }} {{ data.fromCurrency }})
      <span class="amount-column__amount-string--green">+{{ data.amountTo }} {{ data.toCurrency }}</span>
    </strong>
    <strong
      v-else
      class="amount-column__amount-string amount-column__amount-string--bold"
      :class="[{ 'amount-column__amount-string--green': getDirectionBooleanValue(data.directionSymbol) }]">
      {{ data.directionSymbol }} {{ data.amount }} {{ data.fromCurrency }}
    </strong>
  </div>
</template>

<script lang="ts">
// TODO: KEEP
import type { IPlainObject } from '@sdk5/shared/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'amount-column',
})
export default class AmountColumn extends Vue {
  @Prop({ type: Object, required: true }) readonly data!: IPlainObject;

  protected getDirectionBooleanValue(directionSymbol: string): boolean {
    return directionSymbol === '+';
  }
}
</script>

<style lang="scss">
.amount-column {
  &__amount-string {
    @apply inline-flex items-center gap-x-[0.9375rem];

    &--bold {
      @apply font-semibold;
    }

    &--green {
      @apply text-green-amount;
    }
  }
}
</style>
