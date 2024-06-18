<template>
  <transition name="slide-down">
    <app-event-notification
      v-if="isInvoiceVisible"
      :route="invoiceRoute" />
  </transition>
</template>

<script lang="ts">
import { InvoicesRequests } from '@sdk5/shared/requests';
import { defineComponent } from 'vue';
import type { Route } from 'vue-router';

import { AppEventNotification } from '../app-event-notification';

const updateTime: number = 30000;

export default defineComponent({
  name: 'AppNotificationController',
  components: { AppEventNotification },
  props: {
    isIconEnabled: { type: Boolean, default: true },
  },
  data() {
    return {
      isInvoiceVisible: false,
      getPendingInvoicesTimeout: null as ReturnType<typeof setTimeout> | null,
      invoiceRoute: {
        name: 'user-dashboard-invoices',
        query: {
          statuses: encodeURI('["pending"]'),
        },
      },
    };
  },
  watch: {
    $route: [{ deep: true, handler: 'onPageChanged' }],
  },
  created(): void {
    this.getPendingInvoices();
  },
  methods: {
    checkExistingGetPendingInvoicesTimeout() {
      if (this.getPendingInvoicesTimeout === null) {
        return;
      }

      clearTimeout(this.getPendingInvoicesTimeout);
      this.getPendingInvoicesTimeout = null;
    },
    async getPendingInvoices(): Promise<void> {
      const { response, error } = await InvoicesRequests.getRecords({
        filter: {
          statuses: ['pending'],
          direction: 'INCOMING',
        },
        sort: { createdAt: 'desc' },
      });

      if (response && response?.records?.length >= 1) {
        this.isInvoiceVisible = true;
      } else if (error) {
        this.isInvoiceVisible = false;
      } else {
        this.isInvoiceVisible = false;
        this.checkExistingGetPendingInvoicesTimeout();
        this.getPendingInvoicesTimeout = setTimeout(() => {
          this.getPendingInvoices();
        }, updateTime);
      }
    },
    beforeDestroy() {
      this.checkExistingGetPendingInvoicesTimeout();
    },
    async onPageChanged(newRoute: Route, oldRoute: Route): Promise<void> {
      if (oldRoute.name === 'user-dashboard-invoices') {
        await this.getPendingInvoices();
      }

      if (newRoute.name === 'user-dashboard-invoices') {
        this.isInvoiceVisible = false;
      }
    },
  },
});
</script>

<style lang="scss">
.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s ease;
}

.slide-down-leave-active {
  transition: all 0.5s ease;
}
</style>
