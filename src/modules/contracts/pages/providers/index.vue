<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.contracts.providers') }}
    </template>

    <template #actions>
      <app-currency-dropdown label=""/>
    </template>

    <app-tab-links
      :tabs="tabs"
      secondary/>
    <router-view/>
  </dashboard-content-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import ContractsTable from '@/modules/contracts/pages/merchant-contracts/components/contracts-table.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import { IRouteConfig } from '@/types/interfaces';
import { PROVIDERS_CHILDREN } from '@/modules/contracts/routes/providers';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppCurrencyDropdown from '@/modules/contracts/components/app-currency-dropdown.vue';

@Component({
  components: {
    AppCurrencyDropdown,
    AppSelect,
    AppTabLinks,
    ContractsTable,
    AppButton,
    DashboardContentLayout,
  },
})
export default class IndividualContracts extends Vue {

  protected tabs: IRouteConfig[] = PROVIDERS_CHILDREN;

}
</script>
