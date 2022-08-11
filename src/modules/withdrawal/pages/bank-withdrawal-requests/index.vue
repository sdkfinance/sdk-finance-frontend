<template>
  <div>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <bank-withdrawal-requests-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal"/>
    </app-data-table>

    <modal
      v-model="isModalVisible"
      :title="$t('pages.withdrawal.view_modal_title')"
      width="540px">
      <bank-withdrawal-requests-modal
        :form-data="withdrawalModalData"
        @user-action="onWithdrawal"/>
    </modal>
    <confirm-modal
      ref="withdrawalConfirm"
      :title="confirmModalText"/>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import { BankWithdrawalsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import { withdrawalFilters } from '@/modules/withdrawal/filters/filters';
import BankWithdrawalRequestsTable from '@/modules/withdrawal/components/bank-withdrawal-requests-table.vue';
import {
  IWithdrawalOptions,
  IWithdrawalRecord,
  IWithdrawalRecordsResponse,
} from '@/services/requests/bank-withdrawals/Withdrawal.interface';
import Modal from '@/components/modal.vue';
import BankWithdrawalRequestsModal from '@/modules/withdrawal/components/bank-withdrawal-requests-modal.vue';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import ConfirmModal from '@/components/confirm-modal.vue';
import { CONFIRM_ENUM } from '@/constants/enums';

@Component({
  components: {
    AppDataTable,
    BankWithdrawalRequestsTable,
    Modal,
    BankWithdrawalRequestsModal,
    ConfirmModal,
  },
})
export default class BankWithdrawalRequests extends Vue {

  @Ref('withdrawalConfirm') readonly withdrawalConfirm!: ConfirmModal;

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  protected tableData: IWithdrawalRecord[] = [];

  protected filters: ITableFilter[] = withdrawalFilters;

  protected isModalVisible: boolean = false;

  protected isLoading: boolean = false;

  protected confirmModalText: LocaleMessage = this.$t('pages.withdrawal.view_confirm_accept');

  protected withdrawalModalData = {} as IWithdrawalRecord;

  protected submitMethods: { [key: number]: Function } = {
    [CONFIRM_ENUM.accept]: BankWithdrawalsRequests.acceptWithdrawal,
    [CONFIRM_ENUM.decline]: BankWithdrawalsRequests.declineWithdrawal,
  }

  protected async onWithdrawal(action: CONFIRM_ENUM): Promise<void> {
    this.confirmModalText = action === CONFIRM_ENUM.accept
      ? this.$t('pages.withdrawal.view_confirm_accept')
      : this.$t('pages.withdrawal.view_confirm_decline');

    const value = await this.withdrawalConfirm.open();

    if (!value) return;
    const { requestIdentifier } = this.withdrawalModalData;
    this.isLoading = true;
    const { error } = await this.submitMethods[action](requestIdentifier);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.isModalVisible = false;
    this.refDataTable.loadData();
  }

  protected async fetchData(params: IWithdrawalOptions): Promise<IWithdrawalRecordsResponse> {
    this.isLoading = true;
    const options = {
      ...params,
      sort: { createdAt: 'desc' },
      filter: {
        ...params.filter,
      },
    };
    const { response, error } = await BankWithdrawalsRequests.getRecords(options);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    return { response, error };
  }

  protected openModal(withdrawalRecord: IWithdrawalRecord): void {
    this.withdrawalModalData = withdrawalRecord;
    this.isModalVisible = true;
  }

}
</script>
