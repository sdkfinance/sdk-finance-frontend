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
    <slot v-bind="{ contractsList: tableData, isLoading, updateTable }"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Ref, Prop, Vue,
} from 'vue-property-decorator';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import { ContractsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import {
  IContractRecord,
  IContractsFilter,
} from '@/services/requests/contracts/Contracts.types';
import { contractsFilters } from '@/modules/contracts-old/filters/contracts-filters';
import ContractsTable from '@/modules/contracts-old/components/contracts-table.vue';

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

  public updateTable(): void {
    this.refDataTable.loadData();
  }

}
</script>
