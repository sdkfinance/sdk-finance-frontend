<template>
  <transition
    name="slide-down"
    appear>
    <div
      class="event-notification event-notification--front-office"
      @click="eventNotificationClickHandler">
      <div class="event-notification__content">
        <slot name="icon">
          <i
            class="event-notification__icon"
            :class="['event-notification__icon', icon, iconBackgroundColor]" />
        </slot>

        <slot name="title">
          {{ $t(title) }}
        </slot>
      </div>

      <slot name="controls">
        <app-button
          outlined
          size="small"
          :to="route"
          @click="actionButtonClickHandler">
          {{ $t(buttonText) }}
        </app-button>
      </slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import { checkMobile } from '@sdk5/shared/utils';
import type { RawLocation } from 'vue-router';
import { useRouter } from 'vue-router/composables';

import { AppButton } from '../../ui-framework/app-button';

const emit = defineEmits(['action-click']);
const props = withDefaults(
  defineProps<{
    route?: RawLocation;
    icon?: string;
    title: string;
    iconBackgroundColor?: string;
    buttonText: string;
  }>(),
  {
    route: undefined,
    icon: 'icon-info',
    iconBackgroundColor: 'bg-orange-main',
  },
);

const router = useRouter();

const eventNotificationClickHandler = () => {
  const { isWebview } = useIsUaWebview();
  const isMobile = checkMobile();

  if ((isWebview || isMobile) && props.route) {
    router.push(props.route);
  }
};

const actionButtonClickHandler = () => emit('action-click');
</script>

<style lang="scss">
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
}

.slide-down-enter-active {
  transition: all 300ms ease;
}

.slide-down-leave-active {
  transition: all 300ms ease;
}

.event-notification--front-office {
  @apply flex justify-between rounded-lg items-center my-0 mx-auto;
  @apply py-16 px-20 border border-solid border-orange-main h-61 w-full bg-white z-50;

  .app-button {
    @apply sm:inline-flex hidden;
  }

  .event-notification {
    &__icon {
      @apply mr-8 w-20 h-20 text-base inline-flex items-center justify-center rounded-round text-white;
    }

    &__content {
      @apply flex flex-row;
    }
  }
}
</style>
