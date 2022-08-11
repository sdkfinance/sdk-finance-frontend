<template>
  <header
    v-loading="!isProfileLoaded"
    class="dashboard-menu__header">
    <template v-if="isProfileLoaded">
      <div class="dashboard-menu__header__col">
        <img
          class="dashboard-menu__header__pic"
          src="@/assets/images/logo-minimized.svg"
          alt="">
        <router-link
          :to="{ name: 'profile' }">
          <div class="dashboard-menu__header__title">
            {{ personName || $t('pages.profile.title') }}
          </div>
          <div class="dashboard-menu__header__subtitle">
            {{ userRole }}
          </div>
        </router-link>
      </div>
      <div class="dashboard-menu__header__col">
        <!--        <button class="dashboard-menu__header__icon icon-notification"/>-->
        <button
          class="dashboard-menu__header__icon icon-logout"
          :title="$t('action.logout')"
          @click="logout"/>
      </div>
    </template>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import DashboardNavItem from '@/layouts/dashboard/components/dashboard-nav-item.vue';
import { Profile, UserData } from '@/store/modules';

@Component({
  components: {
    DashboardNavItem,
  },
})

export default class DashboardMenuHeader extends Vue {

  protected profileModule = getModule(Profile, this.$store);

  protected userDataModule = getModule(UserData, this.$store);

  protected get isProfileLoaded(): boolean {
    return this.profileModule.isProfileLoaded;
  }

  protected get personName(): string {
    return this.profileModule.personName;
  }

  protected get userRole(): string {
    return this.userDataModule.role;
  }

  protected logout(): void {
    this.userDataModule.logout();
  }

}
</script>

<style lang="scss">
.dashboard-menu__header {
  @apply flex justify-between items-center p-24 border-b border-blue-300 min-h-90;

  &__col {
    @apply flex items-center;
  }

  &__pic {
    @apply w-40 h-40 rounded-7 object-fill mr-8;
  }

  &__title {
    @apply text-base text-gray-500;
  }

  &__subtitle {
    @apply text-sm text-blue-500;
  }

  &__icon {
    @apply text-11 text-blue-500 hover:text-blue-accent transition;

    //&:first-of-type {
    //  @apply mr-14;
    //}
  }
}
</style>
