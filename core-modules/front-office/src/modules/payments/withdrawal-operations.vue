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
import { AppListLink } from '@sdk5/ui-kit-front-office';

import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';
</script>
