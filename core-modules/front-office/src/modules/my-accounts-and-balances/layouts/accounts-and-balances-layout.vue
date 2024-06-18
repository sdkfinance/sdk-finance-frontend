<template>
  <div class="accounts-and-balances-layout">
    <dashboard-content-layout is-secondary>
      <template #title>
        {{ titleString }}
      </template>
      <template #actions>
        <app-button
          :size="APP_BUTTON_SIZE.medium"
          :type="APP_BUTTON_TYPES.secondary"
          @click="transferToAccountButtonClickHandler">
          {{ $t('pages.wallets.transfer_to_account') }}
        </app-button>
        <app-button
          :size="APP_BUTTON_SIZE.medium"
          :type="APP_BUTTON_TYPES.secondary"
          @click="topUpAccountButtonClickHandler">
          {{ $t('pages.wallets.top_up_account') }}
        </app-button>
        <app-button
          :size="APP_BUTTON_SIZE.medium"
          :type="APP_BUTTON_TYPES.secondary"
          @click="currencyExchangeButtonClickHandler">
          {{ $t('pages.wallets.currency_exchange') }}
        </app-button>
      </template>
      <app-tab-links
        :tabs="tabs"
        secondary />
      <router-view />
    </dashboard-content-layout>
  </div>
</template>

<script lang="ts">
import type { IRouteConfig } from '@sdk5/shared/types';
import { APP_BUTTON_SIZE, APP_BUTTON_TYPES, AppButton, AppTabLinks } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

import DashboardContentLayout from '../../../layouts/dashboard/dashboard-content-layout.vue';

const COMPONENTS = {
  DashboardContentLayout,
  AppTabLinks,
  AppButton,
} as const;

@Component({
  name: 'accounts-and-balances-layout',
  components: COMPONENTS,
})
export default class AccountsAndBalancesPageLayout extends Vue {
  static components: typeof COMPONENTS;

  @Prop({
    type: String,
    required: true,
  })
  readonly title!: string;

  @Prop({
    type: Array as PropType<IRouteConfig[]>,
    required: true,
  })
  readonly tabs!: IRouteConfig[];

  protected readonly APP_BUTTON_SIZE = APP_BUTTON_SIZE;

  protected readonly APP_BUTTON_TYPES = APP_BUTTON_TYPES;

  protected get titleString() {
    return this.$t(this.title);
  }

  protected get routeParams() {
    return { backName: this.$route.name, ...(this.$route.params || {}) } as Record<string, string>;
  }

  protected transferToAccountButtonClickHandler() {
    this.$router.push({ name: 'user-make-payment-operations', params: this.routeParams });
  }

  protected topUpAccountButtonClickHandler() {
    this.$router.push({ name: 'user-top-up-operations', params: this.routeParams });
  }

  protected currencyExchangeButtonClickHandler() {
    this.$router.push({ name: 'user-exchange-operations', params: this.routeParams });
  }
}
</script>

<style lang="scss">
.accounts-and-balances-layout {
  .dashboard-content {
    &__actions {
      @apply flex items-center gap-x-[0.5rem];

      .btn + .btn {
        @apply m-0;
      }
    }
  }
}
</style>
