<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.contracts.archived_individual_contracts') }}
    </template>
    <contracts-table
      :data="contractsList"
      :is-loading="isLoading"/>
  </dashboard-content-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import ContractsTable from '@/modules/contracts/pages/individual-contracts/components/contracts-table.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: { ContractsTable, DashboardContentLayout },
})
export default class ArchivePage extends Vue {

  protected isLoading: boolean = false;

  protected contractsList: IPlainObject[] = [
    {
      name: 'Contract 1',
      numberOfUsers: 20301,
      avr: '$25.49',
      date: '2021-09-20T09:21:29.223Z',
      status: 'active',
    },
    {
      name: 'Contract 2',
      numberOfUsers: 14301,
      avr: '$34.49',
      date: '2021-09-20T09:21:29.223Z',
      status: 'active',
    },
    {
      name: 'Contract 3',
      numberOfUsers: 1451,
      avr: '$14.49',
      date: '2021-09-20T09:21:29.223Z',
      status: 'pending',
    },
  ]

}
</script>
