<template>
  <div>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <top-up-requests-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal"/>
    </app-data-table>

    <modal
      v-model="isModalVisible"
      :title="$t('pages.top_up.view_modal_title')"
      width="540px">
      <top-up-requests-modal
        :form-data="topUpModalData"
        @user-action="onUserTriggerTopUp"/>
    </modal>

    <confirm-modal
      ref="userActionConfirm"
      :title="confirmModalText"/>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import { errorNotification, successNotification } from '@/utils';
import Modal from '@/components/modal.vue';
import TopUpRequestsTable from '@/modules/top-up/components/top-up-requests-table.vue';
import TopUpRequestsModal from '@/modules/top-up/components/top-up-requests-modal.vue';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { topUpFilters } from '@/modules/top-up/filters/filters';
import {
  ITopUpFilters,
  ITopUpRecord,
  ITopUpRecordsApiResponse,
} from '@/services/requests/bank-top-ups/TopUp.types';
import { TopUpRequests } from '@/services/requests';
import ConfirmModal from '@/components/confirm-modal.vue';
import { CONFIRM_ENUM } from '@/constants/enums';

@Component({
  components: {
    AppDataTable,
    TopUpRequestsTable,
    Modal,
    TopUpRequestsModal,
    ConfirmModal,
  },
})
export default class TopUpRequestsView extends Vue {

  @Ref('userActionConfirm') readonly actionConfirm!: ConfirmModal;

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  protected tableData: ITopUpRecord[] = [];

  protected filters: ITableFilter[] = topUpFilters;

  protected isModalVisible: boolean = false;

  protected isLoading: boolean = false;

  protected confirmModalText: LocaleMessage = this.$t('pages.top_up.view_confirm_accept');

  protected topUpModalData = {} as ITopUpRecord;

  protected submitMethods: { [key: number]: Function } = {
    [CONFIRM_ENUM.accept]: TopUpRequests.acceptTopUp,
    [CONFIRM_ENUM.decline]: TopUpRequests.declineTopUp,
  }

  protected async fetchData(params: ITopUpFilters): Promise<ITopUpRecordsApiResponse> {
    this.isLoading = true;
    const { response, error } = await TopUpRequests.getRecords(params);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    return { response, error };
  }

  protected async onUserTriggerTopUp(
    { requestId, action, message }: { requestId: number; action: CONFIRM_ENUM; message: string },
  ): Promise<void> {
    this.confirmModalText = this.$t(message);

    const value = await this.actionConfirm.open();

    if (!value) {
      return;
    }

    this.isLoading = true;
    const { error } = await this.submitMethods[action](requestId);
    this.isLoading = false;
    this.isModalVisible = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.refDataTable.loadData();
  }

  protected openModal(topUpRecord: ITopUpRecord): void {
    this.topUpModalData = topUpRecord;
    this.isModalVisible = true;
  }

}
</script>
