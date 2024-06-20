<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.withdrawal_title') }}
    </template>
    <template #subtitle>
      {{ $t('pages.user_dashboard.payments.withdrawal_subtitle') }}
    </template>
    <template #list>
      <app-list-link
        v-if="ENV_VARIABLES.withdrawalRegularBankTransferVisible"
        :to="{ name: 'user-withdrawal-via-bank', params: $route.params }"
        icon="icon-bank"
        title="pages.user_dashboard.payments.regular_bank_transfer" />
      <app-list-link
        :to="{ name: 'user-withdrawal-via-debit-card', params: $route.params }"
        icon="icon-card"
        title="pages.user_dashboard.payments.withdrawal_via_debit_card" />
    </template>
  </payment-operations-layout>
</template>

<script setup lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (!ENV_VARIABLES.withdrawalRegularBankTransferVisible) {
    router.push({
      name: 'user-withdrawal-via-debit-card',
      params: route.params,
    });
  }
});
</script>
