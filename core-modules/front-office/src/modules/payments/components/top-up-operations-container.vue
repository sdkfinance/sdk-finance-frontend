<template>
  <payment-operations-layout>
    <template #title>
      {{ $t('pages.user_dashboard.payments.top_up_title') }}
    </template>
    <template #subtitle>
      {{ $t('pages.user_dashboard.payments.top_up_subtitle') }}
    </template>
    <template #list>
      <slot />
    </template>
  </payment-operations-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import PaymentOperationsLayout from '../../user-dashboard/layouts/payment-operations-layout.vue';

const COMPONENTS = {
  PaymentOperationsLayout,
} as const;

@Component({
  name: 'top-up-operations-container',
  components: COMPONENTS,
})
export default class TopUpOperationsContainer extends Vue {
  static components: typeof COMPONENTS;
}
</script>
