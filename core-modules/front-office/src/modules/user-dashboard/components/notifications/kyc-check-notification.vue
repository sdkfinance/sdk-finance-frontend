<template>
  <app-event-notification
    v-if="isNotificationVisible"
    title="notification.kyc_check_required"
    button-text="action.ok"
    @action-click="actionClickHandler" />
</template>

<script setup lang="ts">
import { ENV_VARIABLES, useGetCurrentUserProfileApi } from '@sdk5/shared';
import { computed, defineAsyncComponent, ref } from 'vue';

const AppEventNotification = defineAsyncComponent(() => import('@sdk5/ui-kit-front-office').then((m) => m.AppEventNotification));

const { userProfileStatus, isFetching: isCurrentUserProfileFetching } = useGetCurrentUserProfileApi();

const notificationVisibleManual = ref(true);

const isNotificationVisible = computed(
  () =>
    ENV_VARIABLES.kycCheckNotificationEnabled &&
    notificationVisibleManual.value &&
    !isCurrentUserProfileFetching.value &&
    userProfileStatus.value !== 'approved',
);

const actionClickHandler = () => {
  notificationVisibleManual.value = false;
};
</script>
