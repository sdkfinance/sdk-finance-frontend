<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_dashboard.make_payment') }}
    </template>
    <div class="make-payment-form">
      <app-tabs
        v-model="currentTab"
        :tabs="tabs"
        secondary />
      <component :is="currentTab" />
    </div>
  </app-form-wrapper>
</template>

<script lang="ts">
import type { ITab } from '@sdk5/ui-kit-front-office';
import { AppFormWrapper, AppTabs } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import MakePaymentForm from './make-payment-form.vue';

@Component({
  name: 'make-payment',
  components: { AppFormWrapper, AppTabs, MakePaymentForm },
})
export default class MakePayment extends Vue {
  protected currentTab: string = '';

  protected tabs: ITab[] = [
    {
      value: 'MakePaymentForm',
      translation: 'pages.user_dashboard.make_payment',
    },
    {
      value: 'div',
      translation: 'pages.user_dashboard.new_payment',
      disabled: true,
    },
  ];
}
</script>
