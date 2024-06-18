<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template #inCurrency="{ scope }"> 1 {{ scope.row.inCurrency.sn }} </template>
    <template #rate="{ scope }"> {{ scope.row.rate || $t('placeholder.no_data') }} {{ scope.row.outCurrency.sn }} </template>
    <template #action="{ scope }">
      <app-button
        size="small"
        @click="openModal(scope.row)">
        {{ $t('action.edit') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import { ROLES } from '@sdk5/shared/constants';
import type { IExchangeRatesRecord } from '@sdk5/shared/requests';
import { UserInstance } from '@sdk5/shared/services';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppButton, AppTable } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppTable,
  AppButton,
} as const;

@Component({
  name: 'currency-exchange-table',
  components: COMPONENTS,
})
export default class CurrencyExchangeTable extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ default: () => [], type: Array as PropType<IExchangeRatesRecord[]> }) readonly data!: IExchangeRatesRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  $props!: {
    data?: IExchangeRatesRecord[];
    isLoading?: boolean;
  };

  @Emit('open-edit-modal')
  protected openModal(row: IExchangeRatesRecord) {
    return row;
  }

  protected columns: ITableColumn[] = [
    {
      prop: 'inCurrency',
      label: 'table.label.sell_amount',
    },
    {
      prop: 'rate',
      label: 'table.label.rate',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
      isHide: !this.isAdministrator,
    },
  ];

  protected get isAdministrator(): boolean {
    return UserInstance.isRole[ROLES.administrator];
  }
}
</script>
