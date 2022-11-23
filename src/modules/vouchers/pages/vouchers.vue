<template>
  <section class="main-section">
    <main-head class="main-head--split">
      <template #title>
        {{ $t('pages.vouchers.title') }}
      </template>
      <template #actions>
        <div class="buttons-container">
          <app-button
            size="small"
            @click="openCreateVoucherForm">
            {{ $t('action.add_new') }}
          </app-button>
          <app-button
            size="small"
            class="button--redeem"
            @click="openVoucherRedeemForm">
            {{ $t('action.redeem') }}
          </app-button>
        </div>
      </template>
    </main-head>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="vouchersFilters"
      :on-load="fetchData">
      <vouchers-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openVoucherDetailsModal"/>
    </app-data-table>
    <modal
      v-model="isVoucherDetailsVisible"
      :title="$t('pages.vouchers.view_modal_title')"
      width="540px">
      <vouchers-form-details
        :form-data="voucherDetails"/>
    </modal>
    <modal
      v-model="isCreateVoucherFormVisible"
      :title="createVoucherModalTitle"
      width="380px"
      @change="createVoucherModalTitle = $t('pages.vouchers.view_create_modal_title')">
      <vouchers-form-add @voucherCreated="onVoucherCreated"/>
    </modal>
    <modal
      v-model="isVoucherRedeemFormVisible"
      :title="redeemVoucherModalTitle"
      width="380px"
      @change="redeemVoucherModalTitle = $t('pages.vouchers.view_redeem_modal_title')">
      <vouchers-form-redeem
        @close="isVoucherRedeemFormVisible = false"
        @voucherActivated="onVoucherActivated"/>
    </modal>
  </section>
</template>

<script lang="ts">
import { LocaleMessage } from 'vue-i18n';
import { Component, Ref, Vue } from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import MainHead from '@/components/main-head.vue';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import VouchersFormAdd from '@/modules/vouchers/components/vouchers-form-add.vue';
import VouchersFormRedeem from '@/modules/vouchers/components/vouchers-form-redeem.vue';
import { VouchersRequests } from '@/services/requests';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import {
  IGetVouchersApiResponse,
  IVouchersOptions,
  IVouchersRecord,
} from '@/services/requests/prepaid-coins/Vouchers.interface';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { errorNotification } from '@/utils';

import VouchersFormDetails from '../components/vouchers-form-details.vue';
import VouchersTable from '../components/vouchers-table.vue';
import { vouchersFilters } from '../filters/filters';

@Component({
  components: {
    MainHead,
    Modal,
    AppDataTable,
    VouchersTable,
    VouchersFormDetails,
    VouchersFormAdd,
    VouchersFormRedeem,
    AppButton,
  },
})
export default class VouchersPage extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  protected tableData: IVouchersRecord[] = [];

  protected voucherDetails: Partial<IVouchersRecord> = {};

  protected isLoading: boolean = false;

  protected isVoucherDetailsVisible: boolean = false;

  protected isCreateVoucherFormVisible: boolean = false;

  protected isVoucherRedeemFormVisible: boolean = false;

  protected coinList: IWalletRecord[] = []

  protected vouchersFilters: ITableFilter[] = vouchersFilters;

  protected createVoucherModalTitle: LocaleMessage = this.$t('pages.vouchers.view_create_modal_title');

  protected redeemVoucherModalTitle: LocaleMessage = this.$t('pages.vouchers.view_redeem_modal_title');

  protected async fetchData(params: IVouchersOptions): Promise<IGetVouchersApiResponse> {
    this.isLoading = true;
    const options: IVouchersOptions = {
      ...params,
      filter: {
        ...params.filter,
      },
      sort: { createdAt: 'desc' },
    };

    const request = await VouchersRequests.getVouchers(options);

    if (request.error) {
      errorNotification(request.error);
    }

    this.isLoading = false;

    return request;
  }

  protected openVoucherDetailsModal(voucher: IVouchersRecord): void {
    this.voucherDetails = voucher;
    this.isVoucherDetailsVisible = true;
  }

  protected openCreateVoucherForm(): void {
    this.isCreateVoucherFormVisible = true;
  }

  protected openVoucherRedeemForm(): void {
    this.isVoucherRedeemFormVisible = true;
  }

  protected onVoucherCreated() {
    this.createVoucherModalTitle = this.$t('pages.vouchers.view_created_modal_title');
    this.refDataTable.loadData();
  }

  protected onVoucherActivated() {
    this.redeemVoucherModalTitle = this.$t('pages.vouchers.view_redeem_activated_modal_title');
  }

}
</script>

<style lang="scss" scoped>
.main-head--split {
  display: flex;
  justify-content: space-between;
}

.buttons-container {
  display: flex;

  .button--redeem {
    margin-left: 15px;
  }
}
</style>
