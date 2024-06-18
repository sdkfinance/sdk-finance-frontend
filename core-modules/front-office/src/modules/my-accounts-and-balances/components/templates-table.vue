<template>
  <base-table-with-filters
    :table-columns="templatesTableColumns"
    :table-data="transferTemplateRecordsWithDisplayAmountFiltered"
    :table-max-height="350">
    <template #filters>
      <app-input-range v-model="inputRangeModel" />
    </template>
    <template #actions>
      <app-button
        :size="APP_BUTTON_SIZE.medium"
        outlined
        @click="emitAddTemplateEvent">
        {{ $t('action.add_template') }}
      </app-button>
    </template>
  </base-table-with-filters>
</template>

<script lang="ts">
import type { ITableColumn } from '@sdk5/shared/types';
import { APP_BUTTON_SIZE, APP_BUTTON_TYPES, AppButton, AppInputRange, type TInputRangeProp } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import type { ITransferTemplateRecord } from '../../../requests';
import BaseTableWithFilters from './base-table-with-filters.vue';

const COMPONENTS = {
  AppInputRange,
  AppButton,
  BaseTableWithFilters,
} as const;

@Component({
  name: 'templates-table',
  components: COMPONENTS,
})
export default class TemplatesTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Array as PropType<ITransferTemplateRecord[]>, required: true }) readonly transferTemplateRecords!: ITransferTemplateRecord[];

  $props!: {
    transferTemplateRecords: ITransferTemplateRecord[];
  };

  protected readonly APP_BUTTON_SIZE = APP_BUTTON_SIZE;

  protected readonly APP_BUTTON_TYPES = APP_BUTTON_TYPES;

  protected readonly templatesTableColumns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.template_name',
      width: '160px',
    },
    {
      prop: 'displayAmount',
      label: 'table.label.amount',
      width: '140px',
    },
    {
      prop: 'description',
      label: 'table.label.description',
    },
    {
      prop: 'action',
      actionsAlwaysVisible: true,
      actions: [
        {
          label: 'action.edit',
          actionFn: (rowScope: { row: ITransferTemplateRecord }) => {
            this.emitEditTemplateEvent(rowScope.row);
          },
          buttonOptions: {
            outlined: true,
            size: APP_BUTTON_SIZE.small,
          },
        },
        {
          label: 'action.repeat',
          actionFn: (rowScope: { row: ITransferTemplateRecord }) => {
            this.emitRepeatTemplateEvent(rowScope.row);
          },
          buttonOptions: {
            outlined: false,
            size: APP_BUTTON_SIZE.small,
            type: APP_BUTTON_TYPES.secondary,
          },
        },
      ],
    },
  ];

  protected inputRangeModel: TInputRangeProp = {
    max: undefined,
    min: undefined,
  };

  protected get transferTemplateRecordsWithDisplayAmount() {
    return this.transferTemplateRecords.map((template) => ({
      ...template,
      displayAmount: `${Intl.NumberFormat().format(template.amount)} ${template.senderCoin.currency.sn}`,
    }));
  }

  protected get transferTemplateRecordsWithDisplayAmountFiltered() {
    const { max, min } = this.inputRangeModel;
    return this.transferTemplateRecordsWithDisplayAmount.filter((template) => {
      const amountNumber = Number(template.amount);
      return (typeof min !== 'number' || amountNumber >= min) && (typeof max !== 'number' || amountNumber <= max);
    });
  }

  @Emit('add-template')
  protected emitAddTemplateEvent() {}

  @Emit('edit-template')
  protected emitEditTemplateEvent(template: ITransferTemplateRecord) {
    return template;
  }

  @Emit('repeat-template')
  protected emitRepeatTemplateEvent(template: ITransferTemplateRecord) {
    return template;
  }
}
</script>
