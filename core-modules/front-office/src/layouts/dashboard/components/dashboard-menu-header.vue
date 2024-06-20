<template>
  <header
    v-loading="!isProfileLoaded"
    class="menu-header">
    <template v-if="isProfileLoaded">
      <div
        v-if="ENV_VARIABLES.brandLogoMUrl"
        class="menu-header__pic">
        <img
          :src="ENV_VARIABLES.brandLogoMUrl"
          alt="" />
      </div>
      <div class="menu-header__user user-data">
        <div class="user-data__name">
          {{ personName || $t('pages.profile.title') }}
        </div>
        <div class="user-data__email">
          {{ personEmail }}
        </div>
      </div>
    </template>
  </header>
</template>

<script lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { Profile } from '@sdk5/shared/store';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import DashboardNavItem from './dashboard-nav-item.vue';

@Component({
  name: 'dashboard-menu-header',
  components: {
    DashboardNavItem,
  },
})
export default class DashboardMenuHeader extends Vue {
  protected profileModule = getModule(Profile, this.$store);

  protected get ENV_VARIABLES() {
    return ENV_VARIABLES;
  }

  protected get isProfileLoaded(): boolean {
    return this.profileModule.isProfileLoaded;
  }

  protected get personName(): string {
    const { first, last } = this.profileModule.namePlain;
    return first && last ? `${first} ${last}` : first || last || '';
  }

  protected get personEmail() {
    return this.profileModule.personEmail;
  }
}
</script>

<style lang="scss" scoped>
.menu-header {
  @apply grid grid-flow-row gap-y-[0.5rem] items-center min-h-90;

  &__pic {
    @apply py-[0.5rem];
  }

  &__user,
  &__pic {
    @apply px-[0.5625rem];
  }

  .user-data {
    @apply grid grid-flow-row;

    &__name,
    &__email {
      @apply text-sm text-gray-500 font-normal;
    }

    &__name {
      @apply font-medium;
    }
  }
}
</style>
