<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.contracts.dashboard.create_a_new_contract') }}
    </template>
    <app-breadcrumbs>
      <template #create-contract="{route}">
        {{ $t(route.meta.translation) }}
      </template>
    </app-breadcrumbs>
    <app-tab-links
      :tabs="tabs"
      size="medium"
      secondary/>
    <router-view/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppBreadcrumbs from '@/components/ui-kit/app-breadcrumbs.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import { CREATE_CONTRACT_CHILDREN } from '@/modules/contracts/routes/create-contracts';
import { IRouteConfig } from '@/types/interfaces';

@Component({
  components: {
    AppBreadcrumbs,
    AppTabLinks,
    DashboardContentLayout,
  },
})
export default class CreateContract extends Vue {

  protected tabs: IRouteConfig[] = CREATE_CONTRACT_CHILDREN;

}
</script>
