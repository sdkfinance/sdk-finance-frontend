<template>
  <div>
    <providers-list-table
      :data="data"
      :is-loading="isLoading"/>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { IPlainObject } from '@/types/interfaces';
import ProvidersListTable from '@/modules/contracts/pages/providers/components/providers-list-table.vue';

@Component({
  components: {
    ProvidersListTable,
  },
})
export default class ProvidersList extends Vue {

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
