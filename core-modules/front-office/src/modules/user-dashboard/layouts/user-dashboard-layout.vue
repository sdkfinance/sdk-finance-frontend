<template>
  <div>
    <header-top-line v-if="isHeaderTopLineVisible" />
    <div
      v-resize:throttle="calculateOffset"
      class="user-dashboard">
      <user-notification-controller />
      <header class="user-dashboard__header">
        <div class="user-dashboard__controls">
          <img
            v-if="ENV_VARIABLES.brandLogoMUrl"
            class="user-dashboard__logo"
            :class="{ 'hidden lg:block': isBackVisible }"
            :src="ENV_VARIABLES.brandLogoMUrl"
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
                :class="{ 'text-primary': isDropDownVisible }"
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
        modal-body-class="user-profile-modal-body"
        is-full-width>
        <user-profile />
      </app-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { useGetCurrentUserProfileApi, useGetVuexModule, useIsUaWebview } from '@sdk5/shared/composables';
import { UserData } from '@sdk5/shared/store';
import type { IOption } from '@sdk5/shared/types';
import { AppDropdown, AppModal, HeaderTopLine } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';
import { nextTick, onMounted, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';

import UserProfile from '../pages/profile/index.vue';

const UserNotificationController = defineAsyncComponent(() => import('../components/notifications/user-notification-controller.vue'));

enum actionTypes {
  route,
  logout,
  profile,
}

type TOptionCommand = {
  action: actionTypes;
};

withDefaults(
  defineProps<{
    backName?: string;
    isBackVisible?: boolean;
  }>(),
  {
    backName: 'user-dashboard',
    isBackVisible: false,
  },
);

const { personName } = useGetCurrentUserProfileApi();
const userDataModule = useGetVuexModule(UserData);
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

const isHeaderTopLineVisible = computed(() => !isWebview && ENV_VARIABLES.headerBackLinkVisible);

const calculateOffset = () => {
  if (!backRef.value || !mainRef.value) {
    return;
  }

  const backOffsetLeft = backRef.value.$el?.offsetLeft;
  const mainOffsetLeft = mainRef.value.offsetLeft;
  const offsetDiff = mainOffsetLeft - backOffsetLeft;
  backOffset.value = `${offsetDiff > 0 ? offsetDiff : 0}px`;
};
const logout = () => {
  userDataModule.logout();
};
const onDropDownChange = (event: TOptionCommand) => {
  if (event.action === actionTypes.logout) {
    logout();
  } else if (event.action === actionTypes.profile) {
    profileModal.value.open();
  }

  appDropdownRef.value.hideDropdown();
};

watchEffect(() => {
  nextTick(() => {
    calculateOffset();
  });
});

onMounted(() => {
  nextTick(() => {
    calculateOffset();
  });
});
</script>

<style lang="scss">
.user-dashboard {
  @apply p-24 sm:p-45 overflow-x-hidden;

  .user-profile-modal-body {
    @apply max-w-[fit-content];
  }

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
    @apply mr-20;
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
