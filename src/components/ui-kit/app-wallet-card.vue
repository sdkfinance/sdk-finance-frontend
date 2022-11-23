<template>
  <component
    :is="to ? 'router-link' : 'div' "
    :to="to"
    class="coin-card"
    :class="{ 'coin-card--has-hover': hasHover }">
    <div class="coin-card__header">
      <div class="card-head">
        <div class="card-head__title">
          {{ mainTitle }}
        </div>
        <div class="card-head__subtitle">
          <span
            class="card-head__subtitle-item"
            @click.prevent="copyData(subtitle)">
            {{ subtitle }}
          </span>
        </div>
      </div>

      <div
        class="coin-card__icon"
        :style="{ backgroundColor: color }">
        <img
          :src="walletCardImageUrl"
          class="coin-card__image"
          :class="{'coin-card__image--contain': isImgContain}"
          alt="Wallet card">
      </div>
    </div>
    <div class="coin-card__value">
      {{ formattedAmountValue }}
    </div>
  </component>
</template>

<script lang="ts">
import { LocaleMessages } from 'vue-i18n';
import {
  Component, Prop,
  Vue,
} from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

import { WALLET_FLOW_TYPES } from '@/constants/wallet-flow-types';
import { errorNotification, successNotification } from '@/utils';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { prefixedMoneyAmount } from '@/utils/moneyAmountFormat';

const inImg = require('@/assets/images/flow/in.png');
const outImg = require('@/assets/images/flow/out.png');
const iconPlaceholder = require('@/assets/icons/empty-category.svg');

const flowValidator = (flow: string): boolean => Object.keys(WALLET_FLOW_TYPES).includes(flow);

@Component
export default class AppWalletCard extends Vue {

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: String, default: '' }) readonly subtitle!: string;

  @Prop({ type: [Number, String], default: 0 }) readonly value!: number;

  @Prop({ type: String, default: '' }) readonly imgUrl!: string;

  @Prop({ type: Boolean, default: false }) readonly isImgContain!: boolean;

  @Prop({ type: Boolean, default: true }) readonly hasHover!: boolean;

  @Prop({ type: String, default: '' }) readonly prefixSymbol!: string;

  @Prop({ type: String, default: '' }) readonly color!: string;

  @Prop({ type: [String, Object], default: '' }) readonly to!: RawLocation;

  @Prop({ type: String, validator: flowValidator, default: WALLET_FLOW_TYPES.default }) readonly moneyFlow!: keyof typeof WALLET_FLOW_TYPES;

  protected iconPlaceholder = iconPlaceholder;

  protected copyData(text: string): void {
    try {
      copyToClipboard(text);
      successNotification('notification.copied');
    } catch (error) {
      errorNotification('notification.copy_failed');
    }
  }

  protected get formattedAmountValue(): string {
    return prefixedMoneyAmount(+this.value.toFixed(2), this.prefixSymbol);
  }

  protected get walletCardImageUrl(): string {
    if (!this.moneyFlow || this.imgUrl) {
      return this.imgUrl;
    }

    if (this.moneyFlow === WALLET_FLOW_TYPES.in) {
      return inImg;
    }

    if (this.moneyFlow === WALLET_FLOW_TYPES.out) {
      return outImg;
    }

    return iconPlaceholder;
  }

  protected get mainTitle(): string | LocaleMessages {
    if (this.moneyFlow === WALLET_FLOW_TYPES.default || !Object.keys(WALLET_FLOW_TYPES).includes(this.moneyFlow)) {
      return this.title;
    }

    return this.moneyFlow === WALLET_FLOW_TYPES.in
      ? this.$t('entity.money_flow.in')
      : this.$t('entity.money_flow.out');
  }

}
</script>

<style lang="scss">
.coin-card {
  box-shadow: 0 4px 12px rgb(161 182 198 / 20%);

  @apply w-full md:w-324 lg:w-268 h-148 transition duration-500 ease-in-out rounded-lg bg-white flex flex-col justify-between py-16
    px-20;

  &--has-hover {
    @apply cursor-pointer;

    &:hover {
      box-shadow: 0 4px 12px rgb(161 182 198 / 50%);
    }
  }

  &__header {
    @apply flex justify-between;
  }

  &__value {
    @apply text-24 font-semibold;
  }

  &__icon {
    @apply rounded-round h-32 w-32 overflow-hidden;
  }

  &__image {
    @apply w-full h-full object-cover object-center;

    &--contain {
      @apply object-scale-down;
    }
  }

  .card-head {
    width: 180px;

    &__title,
    &__subtitle {
      @apply overflow-hidden overflow-ellipsis;
    }

    &__title {
      @apply mb-4 font-medium text-base max-h-40 leading-5;
    }

    &__subtitle {
      @apply text-blue-500 font-medium text-sm max-h-32 leading-4 flex flex-col overflow-visible;

      &-item:hover {
        @apply bg-gray-350 text-blue-accent transition duration-200 ease-in-out;
      }
    }
  }
}
</style>
