<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.make_payment_title') }}
    </template>
    <template #list>
      <template v-for="action of makePaymentActions">
        <app-list-link
          :key="action.routeName"
          :to="{ name: action.routeName, params: $route.params }"
          :icon="action.icon"
          :title="action.title" />
      </template>
    </template>
  </payment-operations-layout>
</template>

<script setup lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { computed } from 'vue';

import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';

interface IMakePaymentActionItem {
  routeName: string;
  icon: string;
  title: string;
  visible: boolean;
}

const makePaymentActions = computed(() => {
  const actions = [
    {
      routeName: 'user-payment-to-card',
      icon: 'icon-card',
      title: 'pages.user_dashboard.payments.transfer_to_card',
      visible: ENV_VARIABLES.makePaymentTransferToCardActionVisible,
    },
    {
      routeName: 'user-payment-to-account',
      icon: 'icon-account',
      title: 'pages.user_dashboard.payments.transfer_to_account',
      visible: ENV_VARIABLES.makePaymentTransferToAccountActionVisible,
    },
    {
      routeName: 'user-mobile-top-up',
      icon: 'icon-mobile',
      title: 'pages.user_dashboard.payments.mobile_top_up',
      visible: ENV_VARIABLES.makePaymentMobileTopUpActionVisible,
    },
    {
      routeName: 'user-bank-transfer',
      icon: 'icon-account',
      title: 'pages.user_dashboard.payments.other_payments',
      visible: ENV_VARIABLES.makePaymentOtherPaymentsActionVisible,
    },
  ] satisfies IMakePaymentActionItem[];

  return actions.filter((action) => action.visible);
});
</script>
