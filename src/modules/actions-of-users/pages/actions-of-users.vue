<template>
  <component
    :is="isFullPage ? 'dashboard-content-layout': 'div'"
    is-secondary
    is-back-hidden>
    <template
      v-if="isTitleVisible"
      #title>
      {{ $t('pages.actions_of_users.title') }}
    </template>
    <app-data-table
      ref="dataTable"
      v-model="tableData"
      :filters="filters"
      :on-load="fetchData">
      <actions-of-users-table
        :data="tableData"
        :is-loading="isLoading"
        @open-modal="openModal"/>
    </app-data-table>
    <modal
      v-model="isModalShow"
      :title="$t('pages.actions_of_users.view_modal_title')"
      width="540px">
      <actions-of-users-form
        :action-id="actionId"/>
    </modal>
  </component>
</template>

<script lang="ts">
import {
  Component, Ref, Prop, Vue,
} from 'vue-property-decorator';
import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import { ActionsOfUsersRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import {
  IActionsOfUsersRecord,
  IActionsOfUsersOptions,
  IActionsOfUsersFilter,
  IGetActionsOfUsersApiResponse,
} from '@/services/requests/actions-of-users/ActionsOfUsers.types';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import AppWalletCard from '@/components/ui-kit/app-wallet-card.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import ActionsOfUsersTable from '../components/actions-of-users-table.vue';
import ActionsOfUsersForm from '../components/actions-of-users-form.vue';
import { actionsOfUsersFilters } from '../filters/filters';

@Component({
  components: {
    AppWalletCard,
    DashboardContentLayout,
    Modal,
    AppDataTable,
    ActionsOfUsersTable,
    ActionsOfUsersForm,
  },
})
export default class ActionsOfUsersPage extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  @Prop({ type: Object, default: () => ({}) }) readonly defaultFilter!: IActionsOfUsersFilter;

  @Prop({ type: Boolean, default: true }) readonly isFullPage!: boolean;

  @Prop({ type: Boolean, default: true }) readonly isTitleVisible!: boolean;

  protected tableData: IActionsOfUsersRecord[] = [];

  protected currencyList: ICurrency[] = [];

  protected actionId: string = '';

  protected isLoading: boolean = false;

  protected isModalShow: boolean = false;

  protected filters: ITableFilter[] = actionsOfUsersFilters;

  protected async fetchData(params: IActionsOfUsersOptions): Promise<IGetActionsOfUsersApiResponse> {
    this.isLoading = true;
    const options: IActionsOfUsersOptions = {
      ...params,
      filter: { ...this.defaultFilter, ...params.filter },
      sort: { dateCreated: 'desc' },
    };
    const { response, error } = await ActionsOfUsersRequests.getRecords(options);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    return { response, error };
  }

  protected openModal(actionId: string): void {
    this.actionId = actionId;
    this.isModalShow = true;
  }

}
</script>
