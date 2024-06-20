<template>
  <div>
    <div class="section-header">
      <span class="section-header__headline">
        {{ $t('pages.accounts.title') }}
      </span>

      <app-button
        class="section-header__button"
        icon="icon-plus"
        transparent
        @click="openAddAccountModal">
        <span class="button-label">
          {{ $t('action.add_account') }}
        </span>
      </app-button>
    </div>

    <div
      v-loading="isWalletsFetching"
      class="cards-container">
      <app-wallet-card
        v-for="(card, i) in coinList"
        :key="`wallet_${i}`"
        :title="card.name"
        :subtitle="card.serial"
        :prefix-symbol="card.currency.symbol"
        :img-url="card.image"
        :value="card.availableAmount"
        :to="{ name: 'user-dashboard-account', params: { serial: card.serial } }"
        mask-subtitle />
    </div>

    <app-modal
      ref="accountFormModalRef"
      modal-body-class="max-w-520"
      is-full-width>
      <template #default="{ onSubmit }">
        <account-form-modal @submit="onSubmit" />
      </template>
    </app-modal>
  </div>
</template>

<script setup lang="ts">
import { useGetWalletsApi } from '@sdk5/shared/composables';
import { AccountFormModal, AppButton, AppModal, AppWalletCard } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { ref } from 'vue';

const { mappedCoins: coinList, isFetching: isWalletsFetching } = useGetWalletsApi();

const accountFormModalRef = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;

const openAddAccountModal = () => {
  accountFormModalRef.value.open();
};
</script>

<style lang="scss">
.section-header {
  @apply flex justify-between items-center mb-24;

  &__headline {
    @apply font-medium text-xl;
  }

  .btn-icon--left {
    @apply mr-0 md:mr-3;
  }
}

.cards-container {
  @apply grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 sm:min-h-150;
}

.button-label {
  @apply hidden md:inline;
}

.form-account {
  @apply flex flex-col;

  &__item {
    @apply mb-32;
  }

  &__button {
    @apply max-w-300 mx-auto w-full;
  }
}
</style>
