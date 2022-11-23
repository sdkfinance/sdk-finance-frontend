<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.bank_accounts.title') }}
      </template>
    </main-head>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="bankAccountFilters"
      :on-load="fetchData">
      <bank-accounts-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal"/>
    </app-data-table>
    <modal
      v-model="isModalShow"
      :title="$t('pages.bank_accounts.view_modal_title')"
      width="380px">
      <bank-accounts-form
        :form-data="formData"
        @approve="onApproveBankAccount"
        @reject="onRejectBankAccount"/>
    </modal>
  </section>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import MainHead from '@/components/main-head.vue';
import Modal from '@/components/modal.vue';
import BankAccountsForm from '@/modules/bank-accounts/components/bank-accounts-form.vue';
import BankAccountsTable from '@/modules/bank-accounts/components/bank-accounts-table.vue';
import { bankAccountFilters } from '@/modules/bank-accounts/filters/filters';
import {
  IBankAccountRecord,
  IBankAccountsApiResponse,
  IViewBankAccountsPayload,
} from '@/services/requests/bank-accounts/BankAccounts.types';
import { BankAccountsRequests } from '@/services/requests/bank-accounts/BankAccountsRequests';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    MainHead,
    AppDataTable,
    Modal,
    BankAccountsTable,
    BankAccountsForm,
  },
})
export default class BankAccounts extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  protected isLoading: boolean = false;

  protected isModalShow: boolean = false;

  protected tableData: IBankAccountRecord[] = [];

  protected formData = {} as IBankAccountRecord;

  protected bankAccountFilters: ITableFilter[] = bankAccountFilters;

  protected async fetchData(params: Partial<IViewBankAccountsPayload>): Promise<IBankAccountsApiResponse> {
    this.isLoading = true;

    const options: Partial<IViewBankAccountsPayload> = {
      ...params,
      sort: { bankName: 'asc' },
    };

    const { response, error } = await BankAccountsRequests.viewBankAccounts(options);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    return { response, error };
  }

  protected async onApproveBankAccount(): Promise<void> {
    this.isLoading = true;

    const { id } = this.formData;
    const { error } = await BankAccountsRequests.approveBankAccount(id);

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.isModalShow = false;
      return;
    }

    successNotification();
    this.isModalShow = false;
    await this.refDataTable.loadData();
  }

  protected async onRejectBankAccount(): Promise<void> {
    this.isLoading = true;

    const { id } = this.formData;
    const { error } = await BankAccountsRequests.rejectBankAccount(id);

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.isModalShow = false;
      return;
    }

    successNotification();
    this.isModalShow = false;
    await this.refDataTable.loadData();
  }

  protected openModal(data: IBankAccountRecord): void {
    this.formData = data;
    this.isModalShow = true;
  }

}
</script>
