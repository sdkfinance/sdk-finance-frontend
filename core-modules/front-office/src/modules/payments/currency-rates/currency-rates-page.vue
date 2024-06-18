<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.currency_rates.title') }}
    </template>
    <template #list>
      <app-list-link
        :to="{ name: 'user-gold-rates' }"
        icon="icon-gold"
        title="pages.user_dashboard.currency_rates.gold_rates" />
    </template>
  </payment-operations-layout>
</template>

<script setup lang="ts">
import { AppListLink } from '@sdk5/ui-kit-front-office';

import PaymentOperationsLayout from '../../user-dashboard/layouts/payment-operations-layout.vue';
</script>
