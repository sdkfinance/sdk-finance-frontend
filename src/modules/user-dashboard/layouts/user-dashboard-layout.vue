<template>
  <div>
    <header-back-link/>
    <div
      v-resize:throttle="calculateOffset"
      class="user-dashboard">
      <app-notification-controller/>
      <header class="user-dashboard__header">
        <div class="user-dashboard__controls">
          <img
            class="user-dashboard__logo"
            :class="{'hidden lg:block': isBackVisible}"
            src="@/assets/images/logo.svg"
            alt="sdk.finance">
          <transition name="fade">
            <router-link
              v-if="isBackVisible"
              ref="back"
              key="backButton"
              :to="{name: backName, params: {...($route.params || {})}}"
              :style="{'padding-left': backOffset}"
              class="user-dashboard__back">
              <i class="icon-back-arrow"/>
              {{ $t('action.back') }}
            </router-link>
          </transition>
        </div>
        <app-dropdown
          :options="profileOptions"
          option-label="label"
          secondary
          min-width="144px"
          @click="onDropDownChange">
          <template #trigger="{ isDropDownVisible }">
            <div class="user-dashboard__account">
              <div
                class="hidden md:block"
                :class="{'text-blue-accent': isDropDownVisible}"
                :title="personName">
                {{ personName || $t('pages.profile.title') }}
              </div>
              <div class="user-dashboard__account__logo">
                <i class="icon-user-profile"/>
              </div>
            </div>
          </template>
        </app-dropdown>
      </header>
      <main
        ref="main"
        class="user-dashboard__main user-dashboard__container">
        <transition name="page">
          <router-view/>
        </transition>
      </main>
      <app-modal
        ref="profileModal"
        modal-body-class="max-w-852"
        is-full-width>
        <user-profile/>
      </app-modal>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Profile, UserData } from '@/store/modules';
import AppDropdown from '@/components/ui-framework/app-dropdown.vue';
import { IPlainObject } from '@/types/interfaces';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import UserProfile from '@/modules/user-dashboard/pages/profile/index.vue';
import AppNotificationController from '@/components/ui-kit/app-notification-controller.vue';
import HeaderBackLink from '@/layouts/components/header-back-link.vue';

enum actionTypes {
  route,
  logout,
  profile
}

type TOptionCommand = {
  action: actionTypes;
}

@Component({
  components: {
    AppNotificationController,
    UserProfile,
    AppModal,
    AppDropdown,
    HeaderBackLink,
  },
})
export default class UserDashboardLayout extends Vue {

  @Ref('profileModal') readonly profileModal!: AppModal;

  @Prop({ type: String, default: 'user-dashboard' }) readonly backName!: string;

  @Prop({ type: Boolean, default: false }) readonly isBackVisible!: object | string;

  protected profileModule = getModule(Profile, this.$store);

  protected userDataModule = getModule(UserData, this.$store);

  protected backOffset: string = '';

  protected profileOptions: IPlainObject[] = [
    {
      label: 'action.profile',
      icon: 'icon-user-profile',
      classes: 'text-blue-600',
      command: { action: actionTypes.profile },
    },
    {
      label: 'action.logout',
      icon: 'icon-logout',
      classes: 'text-blue-600',
      command: { action: actionTypes.logout },
    },
  ]

  protected get personName(): string {
    return this.profileModule.personName;
  }

  protected calculateOffset(): void {
    const { back, main } = this.$refs as { back: any; main: HTMLElement};

    if (!back || !main) return;

    const backOffsetLeft = back.$el?.offsetLeft;
    const mainOffsetLeft = main.offsetLeft;
    const offsetDiff = mainOffsetLeft - backOffsetLeft;
    this.backOffset = `${offsetDiff > 0 ? offsetDiff : 0}px`;
  }

  protected async mounted(): Promise<void> {
    await this.$nextTick();
    this.calculateOffset();
  }

  protected async updated(): Promise<void> {
    await this.$nextTick();
    this.calculateOffset();
  }

  protected logout(): void {
    this.userDataModule.logout();
  }

  protected onDropDownChange(event: TOptionCommand): void {
    if (event.action === actionTypes.logout) {
      this.logout();
    } else if (event.action === actionTypes.profile) {
      this.profileModal.open();
    }
  }

}
</script>

<style lang="scss">
.user-dashboard {
  @apply p-24 sm:p-45 overflow-x-hidden;

  &__header {
    @apply flex items-center justify-between mb-55 sm:mb-48 lg:mb-65 text-lg text-blue-600;
  }

  &__controls {
    @apply flex items-baseline h-20;
  }

  &__back {
    @apply flex items-center;

    i {
      @apply text-xs mr-2 leading-none;
    }
  }

  &__logo {
    @apply h-auto w-100 mr-20;
  }

  &__account {
    @apply flex items-center justify-end transition delay-500;

    &__logo {
      @apply rounded-full w-24 h-24 flex justify-center items-center bg-blue-200 ml-8 text-xs;
    }
  }

  &__main {
    @apply h-auto;
  }

  &__container {
    @apply general-container;
  }
}
</style>
