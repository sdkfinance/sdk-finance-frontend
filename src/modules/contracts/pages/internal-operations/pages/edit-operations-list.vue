<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.contracts.internal_operations.edit_internal_operation_list') }}
    </template>
    <app-breadcrumbs current-page-label="pages.contracts.internal_operations.edit_internal_operation_list"/>
    <app-form
      ref="form"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handlerForm">
      <edit-operations-table-form
        :data="form.operationsData"
        :is-loading="isLoading"/>
      <div class="flex justify-center mt-48">
        <app-button>{{ $t('action.update_internal_operation_list') }}</app-button>
      </div>
    </app-form>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppBreadcrumbs from '@/components/ui-kit/app-breadcrumbs.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import EditOperationsTableForm from '@/modules/contracts/pages/internal-operations/components/edit-operations-table-form.vue';
import OperationsTable from '@/modules/contracts/pages/internal-operations/components/operations-table.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { CatalogsRequests } from '@/services/requests';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppBreadcrumbs,
    AppForm,
    EditOperationsTableForm,
    DashboardContentLayout,
    OperationsTable,
    AppButton,
  },
})
export default class EditOperationsList extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected isLoading: boolean = false;

  protected form: IPlainObject = {
    operationsData: [],
  }

  protected rules: IPlainObject = {
    operationsData: {
      processType: SimpleRequiredValidationRule(),
    },
  }

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

    this.form.operationsData = response?.records || [];

  }

  protected async handlerForm(): Promise<void> {
    // const isValid = await this.appForm.validate();
  }

}
</script>
