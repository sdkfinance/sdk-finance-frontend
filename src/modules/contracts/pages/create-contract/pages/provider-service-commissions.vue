<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      Vadafone
    </template>
    <app-breadcrumbs current-page-label="Vadafone"/>
    <app-tab-links
      secondary
      :tabs="tabs"/>
    <router-view/>
  </dashboard-content-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { IRouteConfig } from '@/types/interfaces';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppBreadcrumbs from '@/components/ui-kit/app-breadcrumbs.vue';
import { PROVIDERS_SERVICES_SETTINGS_CHILDREN } from '@/modules/contracts/routes/create-contracts';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';

@Component({
  components: {
    AppTabLinks,
    AppBreadcrumbs,
    DashboardContentLayout,
  },
})
export default class ProviderServiceCommissions extends Vue {

  protected tabs: IRouteConfig[] = PROVIDERS_SERVICES_SETTINGS_CHILDREN;

}
</script>
