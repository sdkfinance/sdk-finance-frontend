<template>
  <app-form-wrapper is-buttons-align-left>
    <template #title>
      {{ $t('pages.user_dashboard.profile.title') }}
    </template>
    <div class="user-profile-page">
      <app-tabs
        v-model="currentTab"
        :tabs="profileTabs"
        secondary />
      <component :is="currentTabComponent" />
    </div>
  </app-form-wrapper>
</template>

<script setup lang="ts">
import type { ITab } from '@sdk5/ui-kit-front-office';
import { AppFormWrapper, AppTabs } from '@sdk5/ui-kit-front-office';
import type { AsyncComponent } from 'vue';
import { computed, defineAsyncComponent, ref } from 'vue';

const ProfileInformation = defineAsyncComponent(() => import('./information/profile-information.vue'));
const ProfileDocuments = defineAsyncComponent(() => import('./documents/profile-documents.vue'));
const ProfilePassword = defineAsyncComponent(() => import('./password/profile-password.vue'));
const ProfileLoginDetails = defineAsyncComponent(() => import('./login-details/profile-login-details.vue'));
const ProfileSecurity = defineAsyncComponent(() => import('./security/profile-security.vue'));
const ProfileAddress = defineAsyncComponent(() => import('./address/profile-address.vue'));
const ProfilePhoto = defineAsyncComponent(() => import('./profile-photo/profile-photo-form.vue'));

const profileTabs: ITab[] = [
  {
    value: 'ProfileInformation',
    translation: 'pages.user_dashboard.links.personal_information',
    name: 'ProfileInformation',
  },
  {
    value: 'ProfileAddress',
    translation: 'pages.user_dashboard.links.address',
    name: 'ProfileAddress',
  },
  {
    value: 'ProfileDocuments',
    translation: 'pages.user_dashboard.links.documents',
    name: 'ProfileDocuments',
  },
  {
    value: 'ProfilePassword',
    translation: 'pages.user_dashboard.links.password',
    name: 'ProfilePassword',
  },
  {
    value: 'ProfileSecurity',
    translation: 'pages.user_dashboard.links.security',
    name: 'ProfileSecurity',
  },
  {
    value: 'ProfileLoginDetails',
    translation: 'pages.user_dashboard.links.login_details',
    name: 'ProfileLoginDetails',
  },
  {
    value: 'ProfilePhoto',
    translation: 'pages.user_dashboard.links.profile_photo',
    name: 'ProfilePhoto',
  },
];

const currentTab = ref('');

const currentTabComponent = computed(() => {
  const components = {
    ProfileInformation,
    ProfileDocuments,
    ProfilePassword,
    ProfileLoginDetails,
    ProfileSecurity,
    ProfileAddress,
    ProfilePhoto,
  } as Record<string, AsyncComponent>;

  return components[currentTab.value];
});
</script>
