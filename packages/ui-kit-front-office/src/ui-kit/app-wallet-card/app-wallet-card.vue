<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="coin-card"
    :class="{ 'coin-card--has-hover': hasHover }">
    <div class="coin-card__header">
      <div class="card-head">
        <div class="card-head__title">
          {{ $t(mainTitle) }}
        </div>
        <div class="card-head__subtitle">
          <span
            class="card-head__subtitle-item"
            @click.prevent="copyData(subtitle)">
            {{ maskedSubtitle }}
          </span>
        </div>
      </div>

      <div
        class="coin-card__icon"
        :style="{ backgroundColor: color }">
        <img
          :src="walletCardImageUrl"
          class="coin-card__image"
          :class="{ 'coin-card__image--contain': isImgContain }"
          alt="Wallet card" />
      </div>
    </div>
    <div class="coin-card__value">
      {{ formattedAmountValue }}
    </div>
  </component>
</template>

<script setup lang="ts">
import { WALLET_FLOW_TYPES } from '@sdk5/shared/constants';
import { copyToClipboard, errorNotification, prefixedMoneyAmount, successNotification } from '@sdk5/shared/utils';
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { RawLocation } from 'vue-router';

import iconPlaceholder from '../../assets/icons/empty-category.svg';
import inImg from '../../assets/images/flow/in.png';
import outImg from '../../assets/images/flow/out.png';

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  value: { type: [Number, String], default: 0 },
  imgUrl: { type: String, default: '' },
  isImgContain: { type: Boolean, default: false },
  hasHover: { type: Boolean, default: true },
  prefixSymbol: { type: String, default: '' },
  color: { type: String, default: '' },
  to: { type: [String, Object] as PropType<RawLocation>, default: '' },
  moneyFlow: {
    type: String as PropType<keyof typeof WALLET_FLOW_TYPES>,
    validator: (flow: string): boolean => Object.keys(WALLET_FLOW_TYPES).includes(flow),
    default: WALLET_FLOW_TYPES.default,
  },
  type: {
    type: String,
    default: '',
  },
  maskSubtitle: {
    type: Boolean,
    default: false,
  },
});

const maskString = (inputString: string) => {
  if (inputString.length <= 12) {
    return inputString;
  }

  const first4 = inputString.substring(0, 4);
  const last4 = inputString.substring(inputString.length - 4);
  const mask = '****';
  return first4 + mask + last4;
};

const maskedSubtitle = computed(() => {
  if (!props.maskSubtitle) {
    return props.subtitle;
  }

  return maskString(props.subtitle);
});
const formattedAmountValue = computed(() => prefixedMoneyAmount(Number(Number(props.value).toFixed(2)), props.prefixSymbol));
const walletCardImageUrl = computed(() => {
  if (!props.moneyFlow || props.imgUrl) {
    return props.imgUrl;
  }

  if (props.moneyFlow === WALLET_FLOW_TYPES.in) {
    return inImg;
  }

  if (props.moneyFlow === WALLET_FLOW_TYPES.out) {
    return outImg;
  }

  return iconPlaceholder;
});
const mainTitle = computed(() => {
  if (props.moneyFlow === WALLET_FLOW_TYPES.default || !Object.keys(WALLET_FLOW_TYPES).includes(props.moneyFlow)) {
    return props.title;
  }

  return props.moneyFlow === WALLET_FLOW_TYPES.in ? 'entity.money_flow.in' : 'entity.money_flow.out';
});

const copyData = (text: string) => {
  try {
    copyToClipboard(text);
    successNotification('notification.copied');
  } catch (error) {
    errorNotification('notification.copy_failed');
  }
};
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
        @apply bg-gray-350 text-primary transition duration-200 ease-in-out;
      }
    }
  }
}
</style>
