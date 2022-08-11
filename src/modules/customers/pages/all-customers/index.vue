<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.customers.title') }}
    </template>

    <app-tab-links
      :tabs="tabs"
      secondary/>

    <router-view/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainHead from '@/components/main-head.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';

import { IRouteConfig } from '@/types/interfaces';
import { ALL_CUSTOMERS_CHILDREN } from '@/modules/customers/routes/all-customers';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';

@Component({
  components: {
    DashboardContentLayout,
    MainHead,
    AppTabLinks,
  },
})
export default class CustomersPage extends Vue {

  protected tabs: IRouteConfig[] = ALL_CUSTOMERS_CHILDREN;

}
</script>
