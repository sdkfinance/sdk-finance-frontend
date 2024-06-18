<template>
  <div class="amount-row">
    <span>{{ amountString }}</span>
    <app-tooltip
      v-if="tooltipEnabled"
      :placement="tooltipPlacement"
      :content="tooltipContent">
      <div class="amount-row__tooltip icon-info-circle" />
    </app-tooltip>
  </div>
</template>

<script lang="ts">
import config from '@sdk5/shared/config';
import { AppTooltip } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    AppTooltip,
  },
})
export default class TransactionTableAmount extends Vue {
  @Prop({
    type: [String, Number],
  })
  readonly amount?: string | number;

  @Prop({
    type: String,
  })
  readonly currencySymbol?: string;

  @Prop({
    type: String,
    default: undefined,
  })
  readonly tooltipContent!: string;

  @Prop({
    type: String,
    default: 'top',
    validator(value: string): boolean {
      return ['top', 'bottom'].indexOf(value) !== -1;
    },
  })
  readonly tooltipPlacement!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  readonly tooltipEnabled!: boolean;

  protected get amountString() {
    return this.getAmountString({ amountValue: this.amount, currencySymbol: this.currencySymbol });
  }

  protected getAmountString(options: { amountValue?: number | string; currencySymbol?: string }): string {
    const { amountValue, currencySymbol } = options;

    return typeof amountValue !== 'undefined' && currencySymbol ? `${currencySymbol}${amountValue}` : config.emptyChar;
  }
}
</script>

<style lang="scss" scoped>
.amount-row {
  @apply flex items-center gap-x-4;

  &__tooltip {
    @apply text-10 text-blue-500;
  }
}
</style>
