<template>
  <div
    class="card-product-preview"
    :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="card-product-preview__header">
      <img
        class="card-product-preview__logo"
        :src="previewCardLogo"
        alt="SDK.finance" />
    </div>
    <div class="card-product-preview__main">
      <div class="card-product-preview__pan">
        <template v-for="(panPart, index) of displayCardPan">
          <span :key="index">{{ panPart }}</span>
        </template>
      </div>
      <div class="card-product-preview__exp-date">
        <span>{{ expiredDate }}</span>
      </div>
    </div>
    <div class="card-product-preview__footer">
      <div class="card-product-preview__owner">
        <span>{{ cardHolderName }}</span>
      </div>
      <div class="card-product-preview__ms-logo">
        <img
          :src="mastercardLogo"
          alt="Mastercard" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { TUserInfo } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import { defineComponent } from 'vue';
import { getModule } from 'vuex-module-decorators';

import previewCardLogo from '../../assets/images/logo-white.svg';
import mastercardLogo from '../../assets/images/mastercard-logo.svg';

const DEFAULT_CARD_NUMBER = '0212478268742145';
const DEFAULT_EXP_DATE = '02/24';
const DEFAULT_CARD_OWNER = 'Tom Finch';

export default defineComponent({
  name: 'AppCardProductPreview',
  props: {
    cardPan: { type: String, default: DEFAULT_CARD_NUMBER },
    expiredDate: { type: String, default: DEFAULT_EXP_DATE },
    backgroundImage: { type: String, default: '/images/card-products/card-bg-blue.svg' },
  },
  data() {
    return {
      profileModule: getModule(Profile, this.$store),
      previewCardLogo,
      mastercardLogo,
    };
  },
  computed: {
    cardHolderName() {
      const { first, last } = (this.profileModule.personInfo?.nameIntl ?? {}) as TUserInfo;

      if (!first || !last) {
        return DEFAULT_CARD_OWNER;
      }

      return `${first} ${last}`;
    },
    displayCardPan(): string[] {
      return this.cardPan.match(/.{1,4}/g) ?? [];
    },
  },
});
</script>

<style lang="scss" scoped>
.card-product-preview {
  @apply w-full max-w-[16.625rem] p-16 h-[10.375rem] flex flex-col bg-no-repeat;

  &__footer,
  &__pan {
    @apply flex items-center justify-between;
  }

  &__pan,
  &__exp-date {
    @apply font-nunito;
  }

  &__owner,
  &__pan,
  &__exp-date {
    @apply text-white;
  }

  &__main {
    @apply mt-auto grid grid-flow-row gap-y-2;
  }

  &__footer {
    @apply mt-[0.1875rem];
  }

  &__owner {
    @apply text-base font-medium;
  }

  &__pan {
    @apply font-extrabold text-lg;
  }

  &__exp-date {
    @apply font-semibold text-sm leading-6;
  }
}
</style>
