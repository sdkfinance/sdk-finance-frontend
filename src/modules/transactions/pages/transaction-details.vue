<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.transaction_details.title') }}
    </template>

    <app-breadcrumbs current-page-label="pages.transaction_details.title">
      <template #transaction_details="{route}">
        {{ $t(route.meta.translation) }}
      </template>
    </app-breadcrumbs>

    <div class="details-section">
      <ul>
        <li class="details-section__row">
          <span class="details__label">
            {{ $t('pages.transaction_details.transaction_date') }}
          </span>
          <span class="details__value">02.06.2021 11:14:42</span>
        </li>
        <li class="details-section__row">
          <span class="details__label">
            {{ $t('pages.transaction_details.category') }}
          </span>
          <span class="details__value">Food and supermarkets</span>
        </li>
        <li class="details-section__row">
          <span class="details__label">
            {{ $t('pages.transaction_details.transaction_id') }}
          </span>
          <span class="details__value">1f32dec3-7dc6-4bed-84b0-d22d27d75bc2</span>
        </li>
        <li class="details-section__row">
          <span class="details__label">
            {{ $t('pages.transaction_details.status') }}
          </span>
          <span class="details__value">Processed</span>
        </li>
        <li class="details-section__row">
          <span class="details__label">
            {{ $t('pages.transaction_details.currency') }}
          </span>
          <span class="details__value">USD</span>
        </li>
      </ul>
    </div>
  </dashboard-content-layout>
</template>

<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';

import AppBreadcrumbs from '@/components/ui-kit/app-breadcrumbs.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import { TransactionsRequests } from '@/services/requests';
import {
  IGetTransactionApiResponse,
} from '@/services/requests/transactions/Transactions.types';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppBreadcrumbs,
    DashboardContentLayout,
  },
})
export default class TransactionDetails extends Vue {

  protected get transactionId(): string {
    return this.$route.params.id;
  }

  protected created(): void {
    this.fetchData();
  }

  protected isLoading: boolean = false;

  protected transactionData = {};

  protected async fetchData(): Promise<IGetTransactionApiResponse> {
    this.isLoading = true;

    const { response, error } = await TransactionsRequests.getRecord(this.transactionId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return { response, error };
    }

    this.transactionData = response?.process!;

    return { response, error };
  }

}
</script>

<style lang="scss">
.details-section {
  @apply p-16 bg-gray-350;

  &__row {
    @apply flex justify-between;
  }
}

.details__label {
  @apply text-gray-375;
}
</style>
