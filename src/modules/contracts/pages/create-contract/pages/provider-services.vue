<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      Easypay
    </template>
    <app-breadcrumbs current-page-label="Easypay"/>
    <provider-services-table
      :data="providersList"
      :is-loading="isLoading"/>
  </dashboard-content-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import AppBreadcrumbs from '@/components/ui-kit/app-breadcrumbs.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import ProviderServicesTable from '@/modules/contracts/pages/create-contract/components/provider-services-table.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: { AppBreadcrumbs, DashboardContentLayout, ProviderServicesTable },
})
export default class ProviderServices extends Vue {

  protected isLoading: boolean = false;

  protected providersList: IPlainObject[] = [
    {
      status: true,
      service: 'Vodafone',
    },
    {
      status: false,
      service: 'Kyivstar',
    },
    {
      status: true,
      service: 'Paypal',
    },
  ]

}
</script>
