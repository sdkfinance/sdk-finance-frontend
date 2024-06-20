<template>
  <div
    v-loading="isLoading || isLoadingLocal"
    class="card-page">
    <div class="card-page__row">
      <div class="card-page__main">
        <div class="card-page__card-text">
          <img
            src="/images/icons/masterpass.svg"
            class="w-18 h-18"
            alt="" />
          <span>{{ maskedCardNumber }} • {{ expirationDate }}</span>
          <app-badge
            v-if="!!cardState"
            class="card-page__card-status"
            :status="cardState" />
        </div>
        <div class="card-page__title">
          {{ cardName }}
        </div>
        <template v-if="isCardUnActivated">
          <app-button
            type="primary"
            size="big"
            @click="emitActivateCardEvent">
            {{ $t('action.activate_card') }}
          </app-button>
        </template>
        <app-card-progress
          v-else
          class="card-page__progress"
          :amount="currentAccount.amount"
          :available-amount="currentAccount.availableAmount"
          :currency-symbol="currentCurrency" />
      </div>
      <div class="card-page__card">
        <app-card-preview
          :card-number="cardNumber"
          :exp-date="expirationDate"
          :full-name="cardHolder || cardName" />
      </div>
    </div>

    <app-tab-links
      :tabs="tabs"
      secondary />
    <slot />
  </div>
</template>

<script lang="ts">
import { ISSUED_CARD_STATE } from '@sdk5/shared/constants';
import type { ICoin } from '@sdk5/shared/requests';
import type { IRouteConfig } from '@sdk5/shared/types';
import { getDisplayCardNumber } from '@sdk5/shared/utils';
import { AppBadge, AppButton, AppCardPreview, AppCardProgress, AppTabLinks } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router/composables';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../store/modules';

export default defineComponent({
  name: 'CardPage',
  components: {
    AppCardPreview,
    AppCardProgress,
    AppButton,
    AppTabLinks,
    AppBadge,
  },
  props: {
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cardName: { type: String, required: true },
    cardHolder: { type: String, default: null },
    tabs: { type: Array as PropType<IRouteConfig[]>, required: true },
    isLoading: { type: Boolean, default: false },
    cardState: { type: String, default: null },
  },
  setup(props, { emit }) {
    const route = useRoute();

    const isLoadingLocal = ref(false);

    const currentSerial = computed(() => route.params?.serial ?? '');
    const maskedCardNumber = computed(() => getDisplayCardNumber(props.cardNumber || ''));
    const isCardUnActivated = computed(
      () => props.cardState !== null && props.cardState.toLowerCase() === ISSUED_CARD_STATE.UNACTIVATED.toLowerCase(),
    );

    const emitActivateCardEvent = () => {
      emit('activate-card');
    };

    return {
      isLoadingLocal,
      currentSerial,
      maskedCardNumber,
      isCardUnActivated,
      emitActivateCardEvent,
    };
  },
  data() {
    return {
      userCoinsModule: getModule(UserCoins, this.$store),
    };
  },
  computed: {
    coinList(): ICoin[] {
      return this.userCoinsModule.mappedCoins;
    },
    currentAccount(): ICoin {
      return this.coinList.find(({ serial }) => serial === this.currentSerial) || ({} as ICoin);
    },
    currentCurrency(): string {
      return this.currentAccount?.currency?.symbol || '';
    },
  },
  created() {
    this.fetchCoins();
  },
  methods: {
    async fetchCoins() {
      this.isLoadingLocal = true;
      await this.userCoinsModule.fetchCoins();
      this.isLoadingLocal = false;
    },
  },
});
</script>

<style lang="scss">
.card-page {
  &__row {
    @apply flex flex-wrap gap-x-[2rem] gap-y-[1rem] justify-between relative mb-[5rem];
  }

  &__main {
    @apply flex-1 max-w-[24rem] min-w-[15rem];
  }

  &__card {
    @apply sm:static flex-shrink-0;
  }

  &__card-text {
    @apply flex items-center text-gray-400 font-semibold mb-12;

    img {
      @apply mr-8;
    }
  }

  &__title {
    @apply text-primary text-3xl sm:text-40 mb-16;
  }

  &__card-status {
    .badge {
      @apply p-0;
    }

    @apply ml-auto;
  }
}
</style>
