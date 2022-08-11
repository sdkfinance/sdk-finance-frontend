<template>
  <div>
    <user-card
      :info-list="info"
      status="active"/>

    <app-tabs
      v-model="currentPage"
      :tabs="tabs"
      size="medium"
      query-param="child"
      secondary/>

    <component :is="currentPage"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AsyncComponent } from 'vue';
import { IInformationDetails } from '@/types/interfaces/InformationDetails.interface';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppTabLinks from '@/components/ui-kit/app-tab-links.vue';
import UserCard from '@/modules/customers/pages/customer-details/components/user-card.vue';
import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';

const AdditionalInformation: AsyncComponent = () => import(
  '@/modules/customers/pages/customer-details/pages/user-information/additional-information.vue'
);
const ActiveSessions: AsyncComponent = () => import(
  '@/modules/customers/pages/customer-details/pages/user-information/active-sessions.vue'
);
const LoginMap: AsyncComponent = () => import(
  '@/modules/customers/pages/customer-details/pages/user-information/login-map.vue'
);
const AccountsList: AsyncComponent = () => import(
  '@/modules/customers/pages/customer-details/pages/user-information/accounts.vue'
);

const ContractHistory: AsyncComponent = () => import(
  '@/modules/customers/pages/customer-details/pages/user-information/contract-history.vue'
);
const CredentialsHistory: AsyncComponent = () => import(
  '@/modules/customers/pages/customer-details/pages/user-information/credentials-history.vue'
);

@Component({
  components: {
    AppTabs,
    UserCard,
    AppTabLinks,
    DashboardContentLayout,
    AdditionalInformation,
    ActiveSessions,
    LoginMap,
    AccountsList,
    ContractHistory,
    CredentialsHistory,
  },
})
export default class UserInformationPageLayout extends Vue {

  protected tabs: ITab[] = [
    {
      value: 'additional-information',
      translation: 'pages.customer.navigation.link.additional_information',
    },
    {
      value: 'active-sessions',
      translation: 'pages.customer.navigation.link.active_sessions',
    },
    {
      value: 'login-map',
      translation: 'pages.customer.navigation.link.login_map',
    },
    {
      value: 'accounts-list',
      translation: 'pages.customer.navigation.link.accounts',
    },
    {
      value: 'contract-history',
      translation: 'pages.customer.navigation.link.contract_history',
    },
    {
      value: 'credentials-history',
      translation: 'pages.customer.navigation.link.credentials_history',
    },
  ];

  protected currentPage: string = '';

  protected info: IInformationDetails[] = [
    { label: 'gender', value: 'male' },
    { label: 'name surname', value: 'Griffith Donald' },
    { label: 'date of birth:', value: '08/18/1984' },
    { label: 'email address:', value: 'griffithdonald@gmail.com' },
    { label: 'phone number:', value: '+370 643 - 28 - 457' },
  ]

}
</script>
