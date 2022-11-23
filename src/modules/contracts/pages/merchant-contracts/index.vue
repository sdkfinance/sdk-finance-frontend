<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.contracts.merchant_contracts') }}
    </template>
    <template #actions>
      <app-button
        secondary
        :to="{name: 'contract-archive-merchant-contracts'}"
        size="small">
        {{ $t('action.archive') }}
      </app-button>
      <app-button size="small">
        {{ $t('action.create_contract') }}
      </app-button>
    </template>
    <contracts-table
      :data="contractsList"
      :is-loading="isLoading"/>
  </dashboard-content-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import ContractsTable from '@/modules/contracts/pages/merchant-contracts/components/contracts-table.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: { ContractsTable, AppButton, DashboardContentLayout },
})
export default class IndividualContracts extends Vue {

  protected isLoading: boolean = false;

  protected contractsList: IPlainObject[] = [
    {
      name: 'Contract 1',
      numberOfUsers: 20301,
      income: '$25.49',
      date: '2021-09-20T09:21:29.223Z',
      status: 'active',
    },
    {
      name: 'Contract 2',
      numberOfUsers: 14301,
      income: '$34.49',
      date: '2021-09-20T09:21:29.223Z',
      status: 'active',
    },
    {
      name: 'Contract 3',
      numberOfUsers: 1451,
      income: '$14.49',
      date: '2021-09-20T09:21:29.223Z',
      status: 'pending',
    },
  ]

}
</script>
