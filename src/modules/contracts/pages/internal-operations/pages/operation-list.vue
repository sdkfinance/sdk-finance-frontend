<template>
  <div v-loading="isLoading">
    <div class="flex justify-end">
      <app-button
        size="mini"
        :to="{ name: 'internal-operations-list-edit' }">
        {{ $t('action.edit_internal_operation_list') }}
      </app-button>
    </div>
    <operations-table :data="operationsData"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import OperationsTable from '@/modules/contracts/pages/internal-operations/components/operations-table.vue';
import { CatalogsRequests } from '@/services/requests';
import { IOperationFlowRecord } from '@/services/requests/catalogs/Catalogs.types';
import { errorNotification } from '@/utils';

@Component({
  components: { OperationsTable, AppButton },
})
export default class OperationList extends Vue {

  protected isLoading: boolean = false;

  protected operationsData: IOperationFlowRecord[] = [];

  protected created(): void {
    this.fetchData();
  }

  protected async fetchData(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await CatalogsRequests.getOperationFlows();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.operationsData = response?.records || [];

  }

}
</script>
