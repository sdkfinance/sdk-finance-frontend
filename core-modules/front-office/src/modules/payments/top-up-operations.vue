<template>
  <top-up-operations-container>
    <template #default>
      <app-list-link
        :to="{ name: 'user-top-up-payment-card-operations', params: $route.params }"
        icon="icon-card"
        title="pages.user_dashboard.payments.payment_card" />
      <app-list-link
        v-if="ENV_VARIABLES.topUpRegularBankTransferVisible"
        :to="{ name: 'user-top-up-bank', params: $route.params }"
        icon="icon-bank"
        title="pages.user_dashboard.payments.regular_bank_transfer" />
    </template>
  </top-up-operations-container>
</template>

<script setup lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import TopUpOperationsContainer from './components/top-up-operations-container.vue';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (!ENV_VARIABLES.topUpRegularBankTransferVisible) {
    router.push({
      name: 'user-top-up-payment-card-operations',
      params: route.params,
    });
  }
});
</script>
