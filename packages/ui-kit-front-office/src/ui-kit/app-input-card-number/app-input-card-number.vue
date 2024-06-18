<template>
  <app-input
    v-model="inputModel"
    v-mask="cardMask"
    :placeholder="placeholder"
    :label="label">
    <template
      v-if="cardIcon"
      #suffix>
      <img
        class="card-icon"
        :src="cardIcon"
        alt="" />
    </template>
  </app-input>
</template>

<script lang="ts">
import type { IPlainObject } from '@sdk5/shared/types';
import creditCardType from 'credit-card-type';
import { defineComponent } from 'vue';
import { mask } from 'vue-the-mask';

import type { TAppInputValue } from '../../ui-framework/app-input';
import { AppInput } from '../../ui-framework/app-input';

const ICONS: IPlainObject = {
  alipay: '/images/card-brands/alipay.svg',
  amex: '/images/card-brands/amex.svg',
  diners: '/images/card-brands/diners.svg',
  discover: '/images/card-brands/discover.svg',
  elo: '/images/card-brands/elo.svg',
  hiper: '/images/card-brands/hiper.svg',
  hipercard: '/images/card-brands/hipercard.svg',
  jcb: '/images/card-brands/jcb.svg',
  maestro: '/images/card-brands/maestro.svg',
  mastercard: '/images/card-brands/masterpass.svg',
  mir: '/images/card-brands/mir.svg',
  paypal: '/images/card-brands/paypal.svg',
  unionpay: '/images/card-brands/unionpay.svg',
  visa: '/images/card-brands/visa.svg',
};

export default defineComponent({
  name: 'AppInputCardNumber',
  components: { AppInput },
  directives: { mask },
  props: {
    value: { type: [String, Number], required: true },
    label: { type: String, default: 'form.label.card_number' },
    placeholder: { type: String, default: '' },
    isMaskedCardAvailable: { type: Boolean, default: false },
  },
  computed: {
    cardMask(): IPlainObject {
      return {
        mask: this.isMaskedCardAvailable ? '#### **** **** ####' : '#### #### #### ####',
        tokens: {
          '*': {
            pattern: /(\*)|(\d)/,
          },
          '#': { pattern: /\d/ },
        },
      };
    },
    inputModel: {
      get(): TAppInputValue {
        return this.value;
      },
      set(value: TAppInputValue) {
        this.updateValue(value);
      },
    },
    cardType(): string {
      return creditCardType(this.inputModel.toString())?.[0]?.type || '';
    },
    cardIcon(): string | undefined {
      return ICONS[this.cardType];
    },
  },
  methods: {
    updateValue(value: TAppInputValue) {
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.card-icon {
  @apply w-30 h-24;
}
</style>
