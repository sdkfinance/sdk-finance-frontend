<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.kyc.title') }}
    </template>
    <app-tabs
      v-model="currentRole"
      secondary
      query-param="type"
      :tabs="tabs"/>
    <div>
      <div class="counter">
        <div class="counter__label">
          {{ $t('pages.kyc.counter_title') }}
        </div>
        <div class="counter__value">
          {{ isNeedToApprove ? totalRecords: 0 }}
        </div>
      </div>
    </div>
    <app-data-table
      ref="dataTable"
      v-model="records"
      :filters="filters"
      :on-load="fetchData">
      <kyc-table :data="records"/>
    </app-data-table>
  </dashboard-content-layout>
</template>

<script lang="ts">
import {
  Component, Ref, Vue, Watch,
} from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import KycTable from '@/modules/kyc/components/kyc-table.vue';
import { kycFilters } from '@/modules/kyc/filters/filters';
import { UsersRequests } from '@/services/requests';
import { IGetUsersApiResponse, IGetUsersOptions } from '@/services/requests/users/Users.types';
import { errorNotification } from '@/utils';

@Component({
  components: {
    DashboardContentLayout,
    KycTable,
    AppDataTable,
    AppTabs,
  },
})
export default class KYC extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  protected currentRole: string = '';

  protected filters = kycFilters;

  protected records = [];

  protected totalRecords: number = 0;

  protected isNeedToApprove: boolean = false;

  protected tabs: ITab[] = [
    {
      value: 'individual',
      translation: 'pages.users.individual',
    },
    {
      value: 'merchant',
      translation: 'pages.users.corporate',
    },
  ];

  @Watch('currentRole')
  protected async onRoleChanged(): Promise<void> {
    await this.refDataTable.loadData();
  }

  protected async fetchData(options: IGetUsersOptions): Promise<IGetUsersApiResponse> {
    this.isNeedToApprove = options.filter?.identificationStatus === 'pending';

    const request = await UsersRequests.getUsers({
      ...options,
      filter: {
        ...options.filter,
        identificationStatus: options.filter?.identificationStatus || 'pending',
        roles: [this.currentRole],
      },
      sort: {
        createdAt: 'desc',
        ...options.sort,
      },
    });

    if (request.error) {
      errorNotification(request.error);
    }

    this.totalRecords = request.response?.totalRecords || 0;

    return request;
  }

}
</script>

<style lang="scss">
.counter {
  @apply inline-flex flex-col items-center mb-24 text-center;

  &__label {
    @apply text-base text-gray-400 mb-5;
  }

  &__value {
    @apply text-xl text-gray-500 font-semibold;
  }
}
</style>
