<template>
  <customers-table
    :data="data"
    :is-loading="isLoading"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CustomersTable from '@/modules/customers/components/customers-table.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: { CustomersTable },
})
export default class CustomersIndividual extends Vue {

  protected isLoading: boolean = false;

  protected data: IPlainObject[] = [
    {
      id: '100147',
      owner_name: 'Hart Stewart',
      available_amount: 10300,
      cohort: '16W',
      contract: 'Contract 1',
      last_login: '2021-10-19T15:48:16.395Z',
      last_transaction: '2021-10-19T15:48:16.395Z',
      status: 'active',
    },
    {
      id: '100148',
      owner_name: 'Hart Stewart',
      available_amount: 10300,
      cohort: '16W',
      contract: 'Contract 1',
      last_login: '2021-10-19T15:48:16.395Z',
      last_transaction: '2021-10-19T15:48:16.395Z',
      status: 'banned',
    },
  ]

}
</script>
