<template>
  <div>
    <header-top-line v-if="!isWebview" />
    <div
      v-resize:throttle="calculateOffset"
      class="user-dashboard">
      <app-notification-controller />
      <header class="user-dashboard__header">
        <div class="user-dashboard__controls">
          <img
            class="user-dashboard__logo"
            :class="{ 'hidden lg:block': isBackVisible }"
            src="../../../assets/images/logo.svg"
            alt="sdk.finance" />
          <transition name="fade">
            <router-link
              v-if="isBackVisible"
              ref="backRef"
              key="backButton"
              :to="{ name: backName, params: { ...($route.params || {}) } }"
              :style="{ 'padding-left': backOffset }"
              class="user-dashboard__back">
              <i class="icon-back-arrow" />
              {{ $t('action.back') }}
            </router-link>
          </transition>
        </div>
        <app-dropdown
          ref="appDropdownRef"
          :options="profileOptions"
          option-label="label"
          secondary
          min-width="144px"
          @click="onDropDownChange">
          <template #trigger="{ isDropDownVisible }">
            <div class="user-dashboard__account">
              <div
                class="hidden md:block"
                :class="{ 'text-blue-accent': isDropDownVisible }"
                :title="personName">
                {{ personName || $t('pages.profile.title') }}
              </div>
              <div class="user-dashboard__account__logo">
                <i class="icon-user-profile" />
              </div>
            </div>
          </template>
        </app-dropdown>
      </header>
      <main
        ref="mainRef"
        class="user-dashboard__main user-dashboard__container">
        <transition name="page">
          <router-view />
        </transition>
      </main>
      <app-modal
        ref="profileModal"
        modal-body-class="max-w-852"
        is-full-width>
        <user-profile />
      </app-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import { Profile, UserData } from '@sdk5/shared/store';
import type { IOption } from '@sdk5/shared/types';
import { AppDropdown, AppModal, AppNotificationController, HeaderTopLine } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import type { RouterLink } from 'vue-router';
import { getModule } from 'vuex-module-decorators';

import UserProfile from '../pages/profile/index.vue';

enum actionTypes {
  route,
  logout,
  profile,
}

type TOptionCommand = {
  action: actionTypes;
};

export default defineComponent({
  name: 'UserDashboardLayout',
  components: {
    AppNotificationController,
    UserProfile,
    AppModal,
    AppDropdown,
    HeaderTopLine,
  },
  props: {
    backName: { type: String, default: 'user-dashboard' },
    isBackVisible: { type: Boolean, default: false },
  },
  setup() {
    const { isWebview } = useIsUaWebview();
    const profileOptions: IOption[] = [
      {
        label: 'action.profile',
        icon: 'icon-user-profile',
        classes: 'text-blue-600',
        value: '',
        command: { action: actionTypes.profile },
      },
      {
        label: 'action.logout',
        icon: 'icon-logout',
        classes: 'text-blue-600',
        value: '',
        command: { action: actionTypes.logout },
      },
    ];

    const backRef = ref(null) as unknown as Ref<InstanceType<typeof RouterLink> & { $el: HTMLLinkElement }>;
    const mainRef = ref(null) as unknown as Ref<HTMLElement>;
    const appDropdownRef = ref(null) as unknown as Ref<InstanceType<typeof AppDropdown>>;
    const profileModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
    const backOffset = ref('');

    const calculateOffset = () => {
      if (!backRef.value || !mainRef.value) {
        return;
      }

      const backOffsetLeft = backRef.value.$el?.offsetLeft;
      const mainOffsetLeft = mainRef.value.offsetLeft;
      const offsetDiff = mainOffsetLeft - backOffsetLeft;
      backOffset.value = `${offsetDiff > 0 ? offsetDiff : 0}px`;
    };

    onMounted(() => {
      nextTick(() => {
        calculateOffset();
      });
    });

    return {
      isWebview,
      profileOptions,
      profileModal,
      appDropdownRef,
      backOffset,
      backRef,
      mainRef,
      calculateOffset,
    };
  },
  data() {
    return {
      profileModule: getModule(Profile, this.$store),
      userDataModule: getModule(UserData, this.$store),
    };
  },
  computed: {
    personName(): string {
      return this.profileModule.personName;
    },
  },
  updated() {
    this.$nextTick(() => {
      this.calculateOffset();
    });
  },
  methods: {
    logout() {
      this.userDataModule.logout();
    },
    onDropDownChange(event: TOptionCommand) {
      if (event.action === actionTypes.logout) {
        this.logout();
      } else if (event.action === actionTypes.profile) {
        this.profileModal.open();
      }

      this.appDropdownRef.hideDropdown();
    },
  },
});
</script>

<style lang="scss">
.user-dashboard {
  @apply p-24 sm:p-45 overflow-x-hidden;

  &__header {
    @apply flex items-center justify-between mb-55 sm:mb-48 lg:mb-65 text-lg text-blue-600;

    .app-dropdown__trigger {
      i {
        @apply transform-none ml-0;

        font-size: inherit;
      }
    }
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
