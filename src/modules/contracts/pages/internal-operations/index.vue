<template>
  <dashboard-content-layout>
    <template #title>
      {{ $t('pages.contracts.internal_operations.title') }}
    </template>
    <template #actions>
      <app-currency-dropdown label=""/>
    </template>
    <app-tab-links
      :tabs="childrenRoute"
      secondary/>
    <router-view/>
  </dashboard-content-layout>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppCurrencyDropdown from '@/modules/contracts/components/app-currency-dropdown.vue';
import { INTERNAL_OPERATIONS_CHILDREN } from '@/modules/contracts/routes/internal-operations';
import { IRouteConfig } from '@/types/interfaces';

@Component({
  components: {
    AppTabLinks, AppCurrencyDropdown, AppButton, DashboardContentLayout,
  },
})
export default class InternalOperations extends Vue {

  protected isLoading: boolean = false;

  readonly childrenRoute: IRouteConfig[] = INTERNAL_OPERATIONS_CHILDREN;

}
</script>
