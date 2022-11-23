<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.points_of_sale.title') }}
      </template>
      <template #actions>
        <app-button
          size="small"
          @click="isCreateModalShow = true">
          {{ $t('action.add_new') }}
        </app-button>
      </template>
    </main-head>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="[]"
      :on-load="fetchData">
      <points-of-sale-table
        :data="tableData"
        :is-loading="isLoading"/>
    </app-data-table>
    <modal
      v-model="isCreateModalShow"
      :title="$t('pages.points_of_sale.view_modal_create_title')"
      width="380px">
      <points-of-sale-form @close="refDataTable.loadData(); isCreateModalShow = false"/>
    </modal>
  </section>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import MainHead from '@/components/main-head.vue';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import PointsOfSaleForm from '@/modules/points-of-sale/components/points-of-sale-modal-form.vue';
import PointsOfSaleTable from '@/modules/points-of-sale/components/points-of-sale-table.vue';
import { PointsOfSaleRequests } from '@/services/requests';
import {
  IPointOfSaleRecord,
  IPointsOfSaleRecordsResponse,
} from '@/services/requests/points-of-sale/PointsOfSale.types';
import { errorNotification } from '@/utils';

@Component({
  components: {
    MainHead,
    Modal,
    AppButton,
    AppDataTable,
    PointsOfSaleForm,
    PointsOfSaleTable,
  },
})
export default class PointsOfSalePage extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable

  protected tableData: IPointOfSaleRecord[] = [];

  protected isLoading: boolean = false;

  protected isCreateModalShow: boolean = false;

  protected async fetchData(): Promise<IPointsOfSaleRecordsResponse> {
    this.isLoading = true;

    const request = await PointsOfSaleRequests.getRecords();

    this.isLoading = false;

    if (request.error) {
      errorNotification(request.error);
    }

    return request;
  }

}
</script>
