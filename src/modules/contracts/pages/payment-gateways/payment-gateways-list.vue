<template>
  <div>
    <payment-gateways-list-table
      :data="data"
      :is-loading="isLoading"/>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { IPlainObject } from '@/types/interfaces';
import PaymentGatewaysListTable
  from '@/modules/contracts/pages/payment-gateways/components/payment-gateways-list-table.vue';

@Component({
  components: {
    PaymentGatewaysListTable,
  },
})
export default class PaymentGatewaysList extends Vue {

  protected isLoading: boolean = false;

  protected data: IPlainObject[] = [
    {
      name: 'Easypay',
      percent: 80,
      earned_last_month: 60021,
      median_transaction: 230047,
      median_earning: 5.48,
      endDate: 'Active',
      startDate: '2021-10-19T15:48:16.395Z',
      status: 'active',
    },
    {
      name: 'QIWI',
      percent: 12,
      earned_last_month: 7904,
      median_transaction: 150087,
      median_earning: 5.48,
      endDate: 'Active',
      startDate: '2021-10-19T15:48:16.395Z',
      status: 'active',
    },
  ]

}
</script>
