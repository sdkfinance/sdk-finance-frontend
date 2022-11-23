<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template
      #inIssuer="{scope}">
      1 {{ scope.row.inIssuer.sn }}
    </template>
    <template
      #rate="{scope}">
      {{ scope.row.rate || $t('placeholder.no_data') }} {{ scope.row.outIssuer.sn }}
    </template>
    <template
      #action="{scope}">
      <app-button
        size="small"
        @click="openModal(scope.row)">
        {{ $t('action.edit') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ROLES } from '@/constants';
import { IExchangeRatesRecord } from '@/services/requests/exchange-rates/ExchangeRates.types';
import { UserInstance } from '@/services/UserService';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class CurrencyExchangeTable extends Vue {

  @Prop({ default: [], type: Array }) readonly data!: [];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Emit('open-edit-modal')
  protected openModal(row: IExchangeRatesRecord[]): IExchangeRatesRecord[] {
    return row;
  }

  protected columns: ITableColumn[] = [
    {
      prop: 'inIssuer',
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
  ]

  protected get isAdministrator(): boolean {
    return UserInstance.isRole[ROLES.administrator];
  }

}
</script>
