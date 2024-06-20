<template>
  <div class="user-notification-controller">
    <invoice-notification />
    <kyc-check-notification />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const InvoiceNotification = defineAsyncComponent(() => import('./invoice-notification.vue'));
const KycCheckNotification = defineAsyncComponent(() => import('./kyc-check-notification.vue'));
</script>

<style lang="scss">
.user-notification-controller {
  @apply flex flex-col absolute left-0 right-0 top-26 mx-auto gap-y-[0.5rem] sm:max-w-[43.75rem] max-w-[55vw];
}
</style>
