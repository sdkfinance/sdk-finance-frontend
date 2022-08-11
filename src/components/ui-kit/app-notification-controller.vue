<template>
  <transition name="slide-down">
    <app-event-notification
      v-if="isInvoiceVisible"
      :route="invoiceRoute"/>
  </transition>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { InvoicesRequests } from '@/services/requests';
import AppEventNotification from '@/components/ui-kit/app-event-notification.vue';
import { Route } from 'vue-router';

const updateTime: number = 300000;

@Component({
  components: { AppEventNotification },
})
export default class AppNotificationController extends Vue {

  @Prop({ type: Boolean, default: true }) readonly isIconEnabled!: true;

  @Watch('$route', { deep: true })
  protected async onPageChanged(newRoute: Route, oldRoute: Route): Promise<void> {
    if (oldRoute.name === 'user-dashboard-invoices') {
      await this.getPendingInvoices();
    }
    if (newRoute.name === 'user-dashboard-invoices') {
      this.isInvoiceVisible = false;
    }
  }

  protected isInvoiceVisible: boolean = false;

  protected invoiceRoute = {
    name: 'user-dashboard-invoices',
    query: {
      statuses: encodeURI('["pending"]'),
    },
  }

  protected async getPendingInvoices(): Promise<void> {
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
      setTimeout(() => {
        this.getPendingInvoices();
      }, updateTime);
    }
  }

  created(): void {
    this.getPendingInvoices();
  }

}
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
