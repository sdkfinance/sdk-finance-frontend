<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.gate_settings.title') }}
    </template>
    <providers-table
      :data="tableData"
      :is-loading="isLoading"
      @openDetails="goToDetails"/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GateProviderRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import { IGateSetting } from '@/services/requests/gate-providers/GateProviders.types';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import { IPlainObject } from '@/types/interfaces';
import ProvidersTable from '../components/providers-table.vue';

@Component({
  components: {
    DashboardContentLayout,
    ProvidersTable,
  },
})
export default class GateSettingsPage extends Vue {

  protected tableData: IGateSetting[] = [];

  protected isLoading: boolean = false;

  protected async fetchData(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await GateProviderRequests.getProviders();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableData = response?.records || [];
  }

  protected goToDetails({ id, name }: IPlainObject): void {
    this.$router.push({ name: 'gate-account-settings', params: { id }, query: { name } });
  }

  protected created(): void {
    this.fetchData();
  }

}
</script>
