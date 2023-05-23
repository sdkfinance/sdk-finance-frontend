<template>
  <div>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <contracts-table
        :data="tableData"
        :is-loading="isLoading"/>
    </app-data-table>
    <slot v-bind="{ contractsList, isLoading, updateTable }"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import ContractsTable from '@/modules/contracts-old/components/contracts-table.vue';
import { contractsFilters } from '@/modules/contracts-old/filters/contracts-filters';
import { ContractsRequests } from '@/services/requests';
import {
  IContractRecord,
  IContractsFilter,
} from '@/services/requests/contracts/Contracts.types';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppDataTable,
    ContractsTable,
  },
})
export default class ContractsPage extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  @Prop({ type: Object, default: () => ({}) }) readonly defaultFilter!: IContractsFilter

  protected tableData: IContractRecord[] = [];

  protected contractsList: IContractRecord[] = [];

  protected filters = contractsFilters;

  protected isLoading: boolean = false;

  protected async fetchData(params: any): Promise<any> {
    this.isLoading = true;
    const data = {
      ...params,
      filter: {
        ...this.defaultFilter,
        ...params.filter,
      },
    };
    const { response, error } = await ContractsRequests.getRecords(data);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return {};
    }

    return { response, error };
  }

  protected async fetchGlobalContracts(): Promise<void> {
    const data = {
      pageNumber: 0,
      filter: {
        ...this.defaultFilter,
        global: true,
      },
    };
    const { response, error } = await ContractsRequests.getRecords(data);

    if (error) {
      errorNotification(error);
      return;
    }

    this.contractsList = response.records;
  }

  public updateTable(): void {
    this.refDataTable.loadData();
  }

  created() {
    this.fetchGlobalContracts();
  }

}
</script>
