<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.currency_exchange_contracts.title') }}
    </template>
    <template #actions>
      <app-button size="small">
        {{ $t('action.edit_currency_exchange_list') }}
      </app-button>
    </template>
    <currency-exchanges-table
      :data="contractsList"
      :is-loading="isLoading"/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import CurrencyExchangesTable from '@/modules/contracts/pages/currency-exchange-contracts/components/currency-exchanges-table.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: { CurrencyExchangesTable, AppButton, DashboardContentLayout },
})
export default class CurrencyExchangeContracts extends Vue {

  protected isLoading: boolean = false;

  protected contractsList: IPlainObject[] = [
    {
      type: 'EUR to UAH',
      percent: 1,
      earned: '$25.49',
      median_earning: '$12.49',
      median_transactions: 7,
      start_date: '2021-09-20T09:21:29.223Z',
      end_date: '2021-09-20T09:21:29.223Z',
      status: 'active',
    },
    {
      type: 'EUR to UAH',
      percent: 1,
      earned: '$25.49',
      median_earning: '$12.49',
      median_transactions: 7,
      start_date: '2021-09-20T09:21:29.223Z',
      end_date: '2021-09-20T09:21:29.223Z',
      status: 'active',
    },
    {
      type: 'USD to UAH',
      percent: 31,
      earned: '150.49',
      median_earning: '$25',
      median_transactions: 10,
      start_date: '2021-09-20T09:21:29.223Z',
      end_date: '2021-09-20T09:21:29.223Z',
      status: 'pending',
    },
  ]

}
</script>
