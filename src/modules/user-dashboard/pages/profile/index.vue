<template>
  <app-form-wrapper is-buttons-align-left>
    <template #title>
      {{ $t('pages.user_dashboard.profile.title') }}
    </template>
    <div class="user-profile-page">
      <app-tabs
        v-model="currentTab"
        :tabs="profileTabs"
        secondary/>
      <component :is="currentTab"/>
    </div>
  </app-form-wrapper>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';

@Component({
  components: {
    AppTabs,
    AppFormWrapper,
    ProfileInformation: () => import(
      /* webpackChunkName: 'profile-information' */
      '@/modules/user-dashboard/pages/profile/information/profile-information.vue'
    ),
    ProfileDocuments: () => import(
      /* webpackChunkName: 'profile-documents' */
      '@/modules/user-dashboard/pages/profile/documents/profile-documents.vue'
    ),
    ProfilePassword: () => import(
      /* webpackChunkName: 'profile-password' */
      '@/modules/user-dashboard/pages/profile/password/profile-password.vue'
    ),
    ProfileLoginDetails: () => import(
      /* webpackChunkName: 'profile-login-details' */
      '@/modules/user-dashboard/pages/profile/login-details/profile-login-details.vue'
    ),
    ProfileSecurity: () => import(
      /* webpackChunkName: 'profile-security' */
      '@/modules/user-dashboard/pages/profile/security/profile-security.vue'
    ),
  },
})
export default class UserProfile extends Vue {

  protected currentTab: any = '';

  protected profileTabs: ITab[]=[
    {
      value: 'ProfileInformation',
      translation: 'pages.user_dashboard.links.personal_information',
    },
    {
      value: 'ProfileDocuments',
      translation: 'pages.user_dashboard.links.documents',
    },
    {
      value: 'ProfilePassword',
      translation: 'pages.user_dashboard.links.password',
    },
    {
      value: 'ProfileSecurity',
      translation: 'pages.user_dashboard.links.security',
    },
    {
      value: 'ProfileLoginDetails',
      translation: 'pages.user_dashboard.links.login_details',
    },
  ]

}
</script>
