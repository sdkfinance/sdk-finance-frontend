<template>
  <app-event-notification
    v-if="isInvoiceVisible"
    :route="invoiceRoute"
    title="event_notification.you_have_unpaid_invoices"
    button-text="action.view_unpaid_invoices" />
</template>

<script setup lang="ts">
import { InvoicesRequests } from '@sdk5/shared';
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import type { RawLocation } from 'vue-router';
import { onBeforeRouteUpdate } from 'vue-router/composables';

const AppEventNotification = defineAsyncComponent(() => import('@sdk5/ui-kit-front-office').then((m) => m.AppEventNotification));

const updateTime: number = 30000;
const invoiceRoute: RawLocation = {
  name: 'user-dashboard-invoices',
  query: {
    statuses: encodeURI('["pending"]'),
  },
};

const isInvoiceVisible = ref(false);
const getPendingInvoicesTimeout = ref(null as ReturnType<typeof setTimeout> | null);

const checkExistingGetPendingInvoicesTimeout = () => {
  if (getPendingInvoicesTimeout.value === null) {
    return;
  }

  clearTimeout(getPendingInvoicesTimeout.value);
  getPendingInvoicesTimeout.value = null;
};
const getPendingInvoices = async () => {
  const { response, error } = await InvoicesRequests.getRecords({
    filter: {
      statuses: ['pending'],
      direction: 'INCOMING',
    },
    sort: { createdAt: 'desc' },
  });

  if (response && response?.records?.length >= 1) {
    isInvoiceVisible.value = true;
  } else if (error) {
    isInvoiceVisible.value = false;
  } else {
    isInvoiceVisible.value = false;
    checkExistingGetPendingInvoicesTimeout();
    getPendingInvoicesTimeout.value = setTimeout(() => {
      getPendingInvoices();
    }, updateTime);
  }
};

onBeforeRouteUpdate((to, from, next) => {
  next();

  if (to.name === 'user-dashboard-invoices') {
    isInvoiceVisible.value = false;
    return;
  }

  if (from.name === 'user-dashboard-invoices') {
    getPendingInvoices();
  }
});

onMounted(() => {
  getPendingInvoices();
});
onBeforeUnmount(() => {
  if (getPendingInvoicesTimeout.value !== null) {
    clearTimeout(getPendingInvoicesTimeout.value);
  }
});
</script>
