<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.make_payment_title') }}
    </template>
    <template #list>
      <app-list-link
        :to="{ name: 'user-payment-to-card', params: $route.params }"
        icon="icon-card"
        title="pages.user_dashboard.payments.transfer_to_card" />
      <app-list-link
        :to="{ name: 'user-payment-to-account', params: $route.params }"
        icon="icon-account"
        title="pages.user_dashboard.payments.transfer_to_account" />
      <app-list-link
        :to="{ name: 'user-mobile-top-up', params: $route.params }"
        icon="icon-mobile"
        title="pages.user_dashboard.payments.mobile_top_up" />
      <app-list-link
        :to="{ name: 'user-bank-transfer', params: $route.params }"
        icon="icon-account"
        title="pages.user_dashboard.payments.other_payments" />
    </template>
  </payment-operations-layout>
</template>

<script lang="ts">
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';

@Component({
  name: 'make-payment-operations',
  components: { PaymentOperationsLayout, AppListLink },
})
export default class MakePaymentOperations extends Vue {}
</script>
