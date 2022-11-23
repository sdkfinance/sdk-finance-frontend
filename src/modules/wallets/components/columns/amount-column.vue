<template>
  <div>
    <strong
      v-if="data.type === 'exchange_transaction'"
      class="amount-bold">
      (-{{ data.amountFrom }} {{ data.fromCurrency }})<span class="ml-15 green-text">+{{ data.amountTo }} {{ data.toCurrency }}</span>
    </strong>
    <strong
      v-else
      :class="['amount-bold', { 'green-text' : getDirectionBooleanValue(data.directionSymbol) }]">
      {{ data.directionSymbol }} {{ data.amount }} {{ data.fromCurrency }}
    </strong>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IPlainObject } from '@/types/interfaces';

@Component
export default class AmountColumn extends Vue {

  @Prop({ type: Object, required: true }) readonly data!: IPlainObject

  protected getDirectionBooleanValue(directionSymbol: string): boolean {
    return directionSymbol === '+';
  }

}
</script>

<style lang="scss">
.green-text {
  color: $green-color;
}

.ml-15 {
  margin-left: 15px;
}

.amount-bold {
  font-weight: 600;
}

</style>
