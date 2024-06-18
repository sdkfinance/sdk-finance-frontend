<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.currency_exchange_title') }}
    </template>
    <template #subtitle>
      {{ $t('pages.user_dashboard.payments.currency_exchange_subtitle') }}
    </template>
    <template #list>
      <app-list-link
        :to="{ name: 'user-exchange-sell', params: $route.params }"
        icon="icon-sell"
        title="pages.user_dashboard.payments.sell" />
      <app-list-link
        :to="{ name: 'user-exchange-buy', params: $route.params }"
        icon="icon-buy"
        title="pages.user_dashboard.payments.buy" />
    </template>
  </payment-operations-layout>
</template>

<script lang="ts">
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import PaymentOperationsLayout from '../user-dashboard/layouts/payment-operations-layout.vue';

@Component({
  name: 'exchange-operations',
  components: { PaymentOperationsLayout, AppListLink },
})
export default class ExchangeOperations extends Vue {}
</script>
