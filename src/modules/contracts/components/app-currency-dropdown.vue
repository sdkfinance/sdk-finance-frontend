<template>
  <div class="app-currency-dropdown">
    <template v-if="additionalDataVisible">
      <slot name="additional">
        {{ $t(label) }} <span class="app-currency-dropdown__value">{{ additionalData }}</span>
      </slot>
    </template>

    <app-select
      v-model="selectedCurrency"
      is-dropdown
      option-label="label"
      style="width: 115px"
      :options="currencyList"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { IPlainObject } from '@/types/interfaces';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';

@Component({
  components: {
    AppSelect,
  },
})
export default class AppCurrencyDropdown extends Vue {

  @Prop({ type: String, default: 'pages.contracts.dashboard.total_earned' }) readonly label!: string;

  @Prop({ type: Boolean, default: true }) readonly additionalDataVisible!: boolean;

  @Prop({ type: String, default: '' }) readonly additionalData!: string;

  protected currencyList: IPlainObject[] = [
    {
      label: 'USD',
      value: 'USD',
      image: '/images/currencies/usd.svg',
    },
    {
      label: 'EUR',
      value: 'EUR',
      image: '/images/currencies/eur.svg',
    },
  ];

  protected selectedCurrency: IPlainObject = this.currencyList[0];

}
</script>

<style lang="scss">
.app-currency-dropdown {
  @apply flex items-center text-gray-500 text-xl font-semibold;

  &__value {
    @apply text-blue-accent ml-6 mr-12;
  }
}
</style>
