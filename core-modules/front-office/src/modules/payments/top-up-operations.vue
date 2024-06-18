<template>
  <top-up-operations-container>
    <template #default>
      <app-list-link
        :to="{ name: 'user-top-up-payment-card-operations', params: $route.params }"
        icon="icon-card"
        title="pages.user_dashboard.payments.payment_card" />
      <app-list-link
        :to="{ name: 'user-top-up-bank', params: $route.params }"
        icon="icon-bank"
        title="pages.user_dashboard.payments.regular_bank_transfer" />
    </template>
  </top-up-operations-container>
</template>

<script lang="ts">
import { AppListLink } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import TopUpOperationsContainer from './components/top-up-operations-container.vue';

const COMPONENTS = {
  AppListLink,
  TopUpOperationsContainer,
};

@Component({
  name: 'top-up-operations',
  components: COMPONENTS,
})
export default class TopUpOperations extends Vue {
  static components: typeof COMPONENTS;
}
</script>
