<template>
  <section class="main-section">
    <main-head>
      <template #title>
        <router-link :to="{ name: 'points-of-sale' }">
          <i class="el-icon-back" />
        </router-link>
        {{ formData.name }}
      </template>
      <template #actions>
        <div class="buttons-container">
          <app-button
            size="small"
            @click="isEditModalShow = true">
            {{ $t('action.edit') }}
          </app-button>
          <app-button
            size="small"
            @click="deletePos">
            {{ $t('action.delete') }}
          </app-button>
        </div>
      </template>
    </main-head>
    <div class="details">
      <details-list
        title="pages.points_of_sale.information"
        :details="infoDetails" />
      <details-list
        title="pages.points_of_sale.urls_options"
        :details="urlsOptions" />
    </div>

    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <transactions-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal" />
    </app-data-table>

    <modal
      v-model="isEditModalShow"
      :title="$t('pages.points_of_sale.view_modal_edit_title')"
      width="380px">
      <points-of-sale-form
        :data="formData"
        :is-edit-mode="true"
        @close="
          getInfo();
          isEditModalShow = false;
        " />
    </modal>

    <modal
      v-model="isTransactionModalShow"
      :title="$t('pages.transactions.view_modal_title')"
      width="540px">
      <transactions-form :form-data="transactionsData" />
    </modal>

    <confirm-modal
      ref="confirmDeleteModal"
      title="pages.points_of_sale.view_modal_delete_title" />
  </section>
</template>

<script lang="ts">
import type {
  ICurrency,
  IGetTransactionsApiResponse,
  ITransactionCategoryRecord,
  ITransactionsFilter,
  ITransactionsOptions,
  ITransactionsRecord,
} from '@sdk5/shared/requests';
import { CurrencyRequests } from '@sdk5/shared/requests';
import { Catalog } from '@sdk5/shared/store';
import type { IDetailsValue, ITableFilter } from '@sdk5/shared/types';
import { errorNotification } from '@sdk5/shared/utils';
import { AppButton, AppDataTable, ConfirmModal, DetailsList, MainHead, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import type { IPointOfSaleRecord } from '../../../requests';
import { PointsOfSaleRequests } from '../../../requests';
import PointsOfSaleForm from '../components/points-of-sale-modal-form.vue';
import PointsOfSaleTable from '../components/points-of-sale-table.vue';
import TransactionsForm from '../components/transactions-form.vue';
import TransactionsTable from '../components/transactions-table.vue';
import { transactionsFilters } from '../filters';

@Component({
  name: 'points-of-sale-transactions',
  components: {
    MainHead,
    Modal,
    AppButton,
    AppDataTable,
    PointsOfSaleForm,
    PointsOfSaleTable,
    TransactionsForm,
    TransactionsTable,
    DetailsList,
    ConfirmModal,
  },
})
export default class PointsOfSalePage extends Vue {
  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Ref('confirmDeleteModal') readonly confirmDeleteModal!: ConfirmModal;

  @Prop({ type: Object, default: () => ({}) }) readonly defaultFilter!: ITransactionsFilter;

  protected catalogModule = getModule(Catalog, this.$store);

  protected id: string = this.$route.params.id;

  protected tableData: IPointOfSaleRecord[] = [];

  protected formData: Partial<IPointOfSaleRecord> = {};

  protected transactionsData: Partial<ITransactionsRecord> = {};

  protected currencyList: ICurrency[] = [];

  protected isLoading: boolean = false;

  protected isEditModalShow: boolean = false;

  protected isTransactionModalShow: boolean = false;

  protected isDeleteModalShow: boolean = false;

  protected transactionsFilters: ITableFilter[] = transactionsFilters;

  protected get infoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.pos_company_name',
        param: 'name',
        value: this.formData.posCompanyName,
      },
      {
        label: 'form.label.description',
        param: 'description',
        value: this.formData.description,
      },
      {
        label: 'form.label.id',
        param: 'id',
        value: this.formData.id,
      },
      {
        label: 'form.label.trust_certificates',
        param: 'trustAllCertificates',
        value: this.formData.trustAllCertificates,
      },
      {
        label: 'form.label.status',
        param: 'active',
        value: this.formData.active,
      },
    ];
  }

  protected get urlsOptions(): IDetailsValue[] {
    return [
      {
        label: 'table.label.website',
        param: 'website',
        value: this.formData.id,
      },
      {
        label: 'form.label.result_url',
        param: 'serverUrl',
        value: this.formData.serverUrl,
      },
      {
        label: 'form.label.server_url',
        param: 'resultUrl',
        value: this.formData.resultUrl,
      },
      {
        label: 'form.label.categoryName',
        param: 'categoryCode',
        value: this.transactionCategoryList.find(({ code }) => code === this.formData.txCategoryCode)?.name,
      },
      {
        label: 'form.label.categoryCode',
        param: 'categoryCode',
        value: this.formData.txCategoryCode,
      },
    ];
  }

  protected get filters(): ITableFilter[] {
    return this.transactionsFilters.map((el: ITableFilter): ITableFilter => {
      if (el.param === 'currencyCodes') {
        el.options = this.currencyCodes;
      }

      return el;
    });
  }

  protected get currencyCodes() {
    return this.currencyList.reduce((acc, currency: ICurrency) => ({ ...acc, [currency.code]: currency.code }), {});
  }

  protected get transactionCategoryList(): ITransactionCategoryRecord[] {
    return this.catalogModule.transactionCategories;
  }

  created() {
    this.getInfo();
    this.fetchCurrency();
    this.catalogModule.fetchTransactionCategories();
  }

  protected async fetchData(params: ITransactionsOptions): Promise<IGetTransactionsApiResponse> {
    this.isLoading = true;

    const request = await PointsOfSaleRequests.getTransactionRecordByPos({ ...params, filter: { ...this.defaultFilter, ...params.filter } }, this.id);
    this.isLoading = false;

    if (request.error) {
      errorNotification(request.error);
    }

    return request;
  }

  public async fetchCurrency(): Promise<void> {
    const { response, error } = await CurrencyRequests.getCurrencies();

    if (error) {
      errorNotification(error);
      return;
    }

    this.currencyList = response?.records || [];
  }

  protected async getInfo(): Promise<void> {
    this.isLoading = true;

    const { response, error } = await PointsOfSaleRequests.getSpecificRecord(this.id);

    if (response) {
      this.formData = response.pos;
    }

    if (error) {
      errorNotification(error);
    }

    this.isLoading = false;
  }

  protected async deletePos(): Promise<void> {
    const value = await this.confirmDeleteModal.open();

    if (!value) {
      return;
    }

    const { error } = await PointsOfSaleRequests.deleteSpecificRecord(this.id);

    if (error) {
      errorNotification(error);
      return;
    }

    await this.$router.push({ name: 'points-of-sale' });
  }

  protected openModal(data: ITransactionsRecord): void {
    this.transactionsData = data;
    this.isTransactionModalShow = true;
  }
}
</script>

<style lang="scss" scoped>
.buttons-container {
  display: flex;
  margin-left: auto;

  button:last-child {
    margin-left: 10px;
  }
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  margin-bottom: 1rem;
}
</style>
