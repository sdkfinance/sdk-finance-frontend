<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.profile.title') }}
      </template>
    </main-head>

    <tab-links :tabs="links" />

    <router-view />
  </section>
</template>

<script lang="ts">
import type { IRouteConfig } from '@sdk5/shared/types';
import { AppTabLinks as TabLinks, MainHead } from '@sdk5/ui-kit-front-office';
import { Component, Vue } from 'vue-property-decorator';

import { PROFILE_CHILDREN } from '../routes';

@Component({
  components: {
    MainHead,
    TabLinks,
  },
})
export default class ProfileSettings extends Vue {
  protected links: IRouteConfig[] = PROFILE_CHILDREN;
}
</script>

<style lang="scss">
.user-profile {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 60px;

  &--two-column {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
