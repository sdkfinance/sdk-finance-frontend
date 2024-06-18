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
        :is-loading="isLoading" />
    </app-data-table>
    <modal
      v-model="isCreateModalShow"
      :title="$t('pages.points_of_sale.view_modal_create_title')"
      width="380px">
      <points-of-sale-form
        @close="
          refDataTable.loadData();
          isCreateModalShow = false;
        " />
    </modal>
  </section>
</template>

<script lang="ts">
import { errorNotification } from '@sdk5/shared/utils';
import { AppButton, AppDataTable, MainHead, Modal } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';

import type { IPointOfSaleRecord, IPointsOfSaleRecordsResponse } from '../../../requests';
import { PointsOfSaleRequests } from '../../../requests';
import PointsOfSaleForm from '../components/points-of-sale-modal-form.vue';
import PointsOfSaleTable from '../components/points-of-sale-table.vue';

@Component({
  name: 'points-of-sale',
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
  @Ref('dataTable') readonly refDataTable!: AppDataTable;

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
