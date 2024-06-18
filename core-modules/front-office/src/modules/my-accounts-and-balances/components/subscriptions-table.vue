<template>
  <base-table-with-filters
    :table-data="subscriptionTableDataFiltered"
    :table-columns="subscriptionsTableColumns">
    <template #filters>
      <app-select
        v-model="selectedSubscriptionType"
        :options="SUBSCRIPTION_TYPES_ARRAY"
        option-value="value"
        option-label="label"
        label="form.label.subscription_type"
        placeholder="form.label.subscription_type" />
      <app-select
        v-model="selectedSubscriptionStatus"
        :options="SUBSCRIPTION_STATUSES_ARRAY"
        option-value="value"
        option-label="label"
        label="form.label.status"
        placeholder="form.label.status" />
    </template>
    <template #actions>
      <app-button
        :size="APP_BUTTON_SIZE.medium"
        outlined
        @click="addSubscriptionButtonClickHandler">
        {{ $t('action.add_subscription') }}
      </app-button>
    </template>
    <template #status="{ row }">
      <app-badge :status="row.subscriptionStatusLowerCase" />
    </template>
  </base-table-with-filters>
</template>

<script lang="ts">
import { SUBSCRIPTION_STATUSES_ARRAY, SUBSCRIPTION_TYPES_ARRAY } from '@sdk5/shared/constants';
import type { ITableColumn } from '@sdk5/shared/types';
import { APP_BUTTON_SIZE, AppBadge, AppButton, AppSelect } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import type { ISubscriptionRecord } from '../../../requests';
import BaseTableWithFilters from './base-table-with-filters.vue';

const COMPONENTS = {
  BaseTableWithFilters,
  AppButton,
  AppSelect,
  AppBadge,
} as const;

@Component({
  name: 'subscriptions-table',
  components: COMPONENTS,
})
export default class SubscriptionsTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array, required: true }) readonly subscriptions!: ISubscriptionRecord[];

  $props!: {
    subscriptions: ISubscriptionRecord[];
  };

  protected readonly APP_BUTTON_SIZE = APP_BUTTON_SIZE;

  protected readonly SUBSCRIPTION_TYPES_ARRAY = SUBSCRIPTION_TYPES_ARRAY;

  protected readonly SUBSCRIPTION_STATUSES_ARRAY = SUBSCRIPTION_STATUSES_ARRAY;

  protected readonly subscriptionsTableColumns: ITableColumn[] = [
    {
      prop: 'templateDto.name',
      label: 'Template name',
      width: '160px',
    },
    {
      prop: 'displayFrequency',
      label: 'Frequency',
      width: '140px',
    },
    {
      prop: 'recurringStartDate',
      label: 'Subscription start',
      width: '140px',
      type: 'date',
    },
    {
      prop: 'expirationConfig.expirationDate',
      label: 'Subscription end',
      width: '140px',
      type: 'date',
    },
    {
      prop: 'type',
      label: 'Subscription type',
      width: '140px',
    },
    {
      prop: 'status',
      label: 'Status',
    },
    {
      prop: 'action',
      actions: [
        {
          label: 'action.edit',
          actionFn: (rowScope: { row: ISubscriptionRecord }) => {
            this.emitEditSubscriptionEvent(rowScope.row);
          },
        },
      ],
    },
  ];

  protected selectedSubscriptionType = '';

  protected selectedSubscriptionStatus = '';

  protected get subscriptionTableData() {
    return this.subscriptions.map((subscription) => ({
      ...subscription,
      subscriptionStatusLowerCase: subscription.subscriptionStatus.toLowerCase(),
      displayFrequency: `${Intl.NumberFormat().format(subscription.frequency)} ${this.$t(
        `entity.subscription_types.card.${subscription.type.toLowerCase()}`,
      )}`,
    }));
  }

  protected get subscriptionTableDataFiltered() {
    return this.subscriptionTableData.filter((subscription) => {
      return (
        (!this.selectedSubscriptionType || this.selectedSubscriptionType === subscription.type) &&
        (!this.selectedSubscriptionStatus || this.selectedSubscriptionStatus === subscription.subscriptionStatus)
      );
    });
  }

  protected addSubscriptionButtonClickHandler() {
    this.emitAddSubscriptionEvent();
  }

  @Emit('add-subscription')
  protected emitAddSubscriptionEvent() {}

  @Emit('edit-subscription')
  protected emitEditSubscriptionEvent(payload: ISubscriptionRecord) {
    return payload;
  }
}
</script>
