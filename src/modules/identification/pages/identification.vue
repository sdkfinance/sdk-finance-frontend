<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.identification.title') }}
      </template>
    </main-head>

    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="identificationFilters"
      :on-load="fetchData">
      <identification-table
        :data="tableData"
        :is-loading="isLoading"
        @approve="onApprove"
        @decline="onDecline"/>
    </app-data-table>
  </section>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import MainHead from '@/components/main-head.vue';
import { ProfileRequests, UsersRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import {
  IUserRecord,
  IGetUsersOptions,
  IGetUsersApiResponse,
} from '@/services/requests/users/Users.types';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import IdentificationTable from '@/modules/identification/components/identification-table.vue';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { identificationFilters } from '@/modules/identification/filters/filters';

@Component({
  components: {
    AppTable,
    AppButton,
    MainHead,
    AppDataTable,
    IdentificationTable,
  },
})
export default class Identification extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  protected tableData: IUserRecord[] = [];

  protected isLoading: boolean = false;

  protected identificationFilters: ITableFilter[] = identificationFilters;

  protected async fetchData(options: IGetUsersOptions): Promise<IGetUsersApiResponse> {
    this.isLoading = true;
    const { response, error } = await UsersRequests.getUsers(options);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    return { response, error };
  }

  protected async onDecline(id: string): Promise<void> {
    const { error } = await ProfileRequests.declineIdentification(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.refDataTable.loadData();
  }

  protected async onApprove(id: string): Promise<void> {
    const { error } = await ProfileRequests.approveIdentification(id);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.refDataTable.loadData();
  }

}
</script>
