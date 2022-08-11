<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template
      #providerCommission="{scope}">
      {{ getCommission(scope.row.providerCommission, currency) }}
    </template>
    <template
      #totalCommission="{scope}">
      {{ getCommission(scope.row.totalCommission, currency) }}
    </template>
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          @click="onEdit(scope.row)">
          {{ $t('action.edit') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import { TCommissionValue } from '@/services/requests/contracts/Commissions.types';
import { renderCommission } from '@/modules/contracts-old/utils/renderCommission';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class CommissionTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  @Prop({ default: '', type: String }) private currency!: string;

  protected columns: ITableColumn[] = [
    {
      prop: 'txType',
      label: 'table.label.transaction_type',
    },
    {
      prop: 'providerCommission',
      label: 'table.label.provider_commission',
    },
    {
      prop: 'totalCommission',
      label: 'table.label.total_commission',
    },
    {
      prop: 'active',
      label: 'table.label.active',
      width: '120px',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ]

  @Emit('on-edit')
  protected onEdit <T>(record: T): T {
    return record;
  }

  protected getCommission(value: TCommissionValue, currency: string): string {
    return renderCommission.call(this, value, currency);
  }

}
</script>
