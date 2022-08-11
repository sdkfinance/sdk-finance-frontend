<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ providerName || $t('pages.gate_settings.title') }}
    </template>
    <account-settings-table
      :data="tableData"
      :is-loading="isLoading"
      @updateValue="updateValue"/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GateProviderRequests } from '@/services/requests';
import { successNotification, errorNotification } from '@/utils';
import { IAccountSetting, IAccountSettingRequest } from '@/services/requests/gate-providers/GateProviders.types';
import { IPlainObject } from '@/types/interfaces';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AccountSettingsTable from '../components/account-settings-table.vue';

@Component({
  components: {
    DashboardContentLayout,
    AccountSettingsTable,
  },
})
export default class AccountSettingsPage extends Vue {

  protected tableData: IAccountSetting[] = [];

  protected isLoading: boolean = false;

  protected get providerName(): string {
    return this.$route.query?.name as string || '';
  }

  protected async fetchData(): Promise<void> {
    this.isLoading = true;
    const { id } = this.$route.params;
    const { response, error } = await GateProviderRequests.getProvidersSettings(id);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableData = response?.fields || [];
  }

  protected async updateValue(data: IPlainObject): Promise<void> {

    const requestData: IAccountSettingRequest = {
      fields: [
        {
          name: data.name,
          value: data.value,
        },
      ],
    };

    this.isLoading = true;
    const { id } = this.$route.params;
    const { error } = await GateProviderRequests.updateProviderSettings(id, requestData);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

  protected created(): void {
    this.fetchData();
  }

}
</script>
