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
        :src="cardIcon"
        alt=""
        class="w-30 h-24 mr-4 mt-5">
    </template>
  </app-input>
</template>

<script lang="ts">

import creditCardType from 'credit-card-type';
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import { mask } from 'vue-the-mask';

import AppInput, { TInputValue } from '@/components/ui-framework/app-input.vue';
import { IPlainObject } from '@/types/interfaces';

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

@Component({
  components: { AppInput },
  directives: { mask },
})
export default class AppInputCardNumber extends Vue {

  @Prop({ type: [String, Number], required: true }) readonly value!: TInputValue;

  @Prop({ type: String, default: 'form.label.card_number' }) readonly label!: string;

  @Prop({ type: String, default: '' }) readonly placeholder!: string;

  @Prop({ type: Boolean, default: false }) readonly isMaskedCardAvailable!: boolean;

  protected get cardMask(): IPlainObject {
    return {
      mask: this.isMaskedCardAvailable ? '#### **** **** ####' : '#### #### #### ####',
      tokens: {
        '*': {
          pattern: /(\*)|(\d)/,
        },
        '#': { pattern: /\d/ },
      },
    };
  }

  protected get inputModel(): TInputValue {
    return this.value;
  }

  protected set inputModel(value: TInputValue) {
    this.updateValue(value);
  }

  protected get cardType(): string {
    return creditCardType(this.inputModel.toString())?.[0]?.type || '';
  }

  protected get cardIcon(): string | undefined {
    return ICONS[this.cardType];
  }

  @Emit('input')
  protected updateValue(value: TInputValue): TInputValue {
    return value;
  }

}
</script>
