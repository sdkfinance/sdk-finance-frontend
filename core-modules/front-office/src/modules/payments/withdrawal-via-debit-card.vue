<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.withdrawal_via_debit_card_title') }}
    </template>
    <template #list>
      <app-list-link
        :to="{ name: 'user-withdrawal-via-corefy', params: $route.params }"
        :icon-path="corefyIcon"
        title="pages.user_dashboard.payments.corefy" />
    </template>
  </payment-operations-layout>
</template>

<script setup lang="ts">
import { AppListLink } from '@sdk5/ui-kit-front-office';

import corefyIcon from '../../assets/icons/corefy.svg';
import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';
</script>
