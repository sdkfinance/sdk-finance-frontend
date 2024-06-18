<template>
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
        :to="route">
        {{ $t(buttonText) }}
      </app-button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import { checkMobile } from '@sdk5/shared/utils';
import type { RawLocation } from 'vue-router';
import { useRouter } from 'vue-router/composables';

import { AppButton } from '../../ui-framework/app-button';

const props = withDefaults(
  defineProps<{
    route?: RawLocation;
    icon?: string;
    title?: string;
    iconBackgroundColor?: string;
    buttonText?: string;
  }>(),
  {
    route: '',
    icon: 'icon-info',
    title: 'event_notification.you_have_unpaid_invoices',
    iconBackgroundColor: 'bg-orange-main',
    buttonText: 'action.view_unpaid_invoices',
  },
);

const router = useRouter();

const eventNotificationClickHandler = () => {
  const { isWebview } = useIsUaWebview();
  const isMobile = checkMobile();

  if (isWebview || isMobile) {
    router.push(props.route);
  }
};
</script>

<style lang="scss">
.event-notification--front-office {
  transform: translateY(0);

  @apply flex justify-between absolute rounded-lg items-center my-0 mx-auto left-0 right-0 top-26;
  @apply py-16 px-20 border border-solid border-orange-main h-61 sm:max-w-[43.75rem] max-w-[55vw] w-screen bg-white z-50;

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
