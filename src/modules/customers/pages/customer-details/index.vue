<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $route.params.id }}
    </template>

    <template #actions>
      <app-button
        secondary
        size="small">
        {{ $t('pages.customer.action.deactivate_customer') }}
      </app-button>
    </template>

    <app-breadcrumbs :current-page-label="'Customer details'"/>

    <app-tabs
      v-model="currentPage"
      :tabs="tabs"
      size="medium"
      query-param="page"
      secondary/>

    <component :is="currentPage"/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { AsyncComponent } from 'vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppBreadcrumbs from '@/components/ui-kit/app-breadcrumbs.vue';
import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';

const DisputesList: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/disputes.vue');
const CustomerTransactions: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/customer-transactions.vue');
const KYC: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/kyc.vue');
const EarningsList: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/earnings.vue');
const LoginHistory: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/login-history.vue');

const SupportHistory: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/support-history.vue');
const UserInformationPage: AsyncComponent = () => import('@/modules/customers/pages/customer-details/pages/user-information/index.vue');

@Component({
  components: {
    AppTabs,
    AppBreadcrumbs,
    AppButton,
    DashboardContentLayout,
    AppTabLinks,
    UserInformationPage,
    DisputesList,
    CustomerTransactions,
    KYC,
    EarningsList,
    LoginHistory,
    SupportHistory,
  },
})
export default class CustomersPage extends Vue {

  protected tabs: ITab[] = [
    {
      value: 'user-information-page',
      translation: 'pages.customer.navigation.link.user_information',
    },
    {
      value: 'disputes-list',
      translation: 'pages.customer.navigation.link.disputes',
    },
    {
      value: 'customer-transactions',
      translation: 'pages.customer.navigation.link.transactions',
    },
    {
      value: 'KYC',
      translation: 'pages.customer.navigation.link.kyc',
    },
    {
      value: 'earnings-list',
      translation: 'pages.customer.navigation.link.earnings',
    },
    {
      value: 'login-history',
      translation: 'pages.customer.navigation.link.login_history',
    },
    {
      value: 'support-history',
      translation: 'pages.customer.navigation.link.support_history',
    },
  ];

  protected currentPage: string = '';

}
</script>
