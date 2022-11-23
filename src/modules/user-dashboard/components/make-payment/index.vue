<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_dashboard.make_payment') }}
    </template>
    <div class="make-payment-form">
      <app-tabs
        v-model="currentTab"
        :tabs="tabs"
        secondary/>
      <component :is="currentTab"/>
    </div>
  </app-form-wrapper>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import MakePaymentForm from '@/modules/user-dashboard/components/make-payment/make-payment-form.vue';

@Component({
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
  ]

}
</script>
