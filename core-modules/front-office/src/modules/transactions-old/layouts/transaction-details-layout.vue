<template>
  <dashboard-content-layout
    :breadcrumbs="breadcrumbs"
    class="transaction-details-layout">
    <template #title>
      {{ pageTitle }}
    </template>
    <div class="transaction-details-layout__content">
      <router-view />
    </div>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import DashboardContentLayout from '../../../layouts/dashboard/dashboard-content-layout.vue';

const COMPONENTS = {
  DashboardContentLayout,
} as const;

@Component({
  components: COMPONENTS,
})
export default class TransactionDetailsLayout extends Vue {
  static components: typeof COMPONENTS;

  protected get pageTitle() {
    return this.$t(this.$route.meta?.translation).toString();
  }

  protected get transactionId() {
    return this.$route.params.transactionId as string;
  }

  protected get breadcrumbs() {
    if (typeof this.$route.meta?.layout?.breadcrumbs === 'function') {
      return this.$route.meta?.layout?.breadcrumbs.call(this, this.$route);
    }

    return [];
  }
}
</script>

<style lang="scss">
.transaction-details-layout {
  @apply bg-[#fcfcfd];

  .dashboard-content__header {
    @apply mb-[2rem];
  }
}
</style>
