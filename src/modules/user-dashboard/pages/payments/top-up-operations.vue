<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.top_up_title') }}
    </template>
    <template #subtitle>
      {{ $t('pages.user_dashboard.payments.top_up_subtitle') }}
    </template>
    <template #list>
      <app-list-link
        :to="{ name: 'user-top-up-card', params: $route.params}"
        icon="icon-card"
        title="pages.user_dashboard.payments.debit_card"/>
      <app-list-link
        :to="{ name: 'user-top-up-bank', params: $route.params}"
        icon="icon-bank"
        title="pages.user_dashboard.payments.regular_bank_transfer"/>
    </template>
  </payment-operations-layout>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PaymentOperationsLayout from '@/modules/user-dashboard/layouts/payment-operations-layout.vue';
import AppListLink from '@/components/ui-kit/app-list-link.vue';

@Component({
  components: { PaymentOperationsLayout, AppListLink },
})
export default class TopUpOperations extends Vue {
}
</script>
