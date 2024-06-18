<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template #action="{ scope: { row } }">
      <div class="table-actions">
        <app-button
          size="small"
          @click="openModal(row)">
          {{ $t('action.view_details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import type { IVouchersRecord } from '@sdk5/shared/requests';
import type { ITableColumn } from '@sdk5/shared/types';
import { AppButton, AppTable } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'vouchers-table',
  components: {
    AppTable,
    AppButton,
  },
})
export default class VouchersTable extends Vue {
  @Prop({ required: true, type: Array }) readonly data!: IVouchersRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly columns: ITableColumn[] = [
    {
      prop: 'serial',
      label: 'table.label.serial',
      width: '140px',
    },
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      type: 'datetime',
    },
    {
      prop: 'activatedAt',
      label: 'table.label.activatedAt',
      type: 'datetime',
    },
    {
      prop: 'amount',
      label: 'table.label.amount',
    },
    {
      prop: 'status',
      label: 'table.label.status',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ];

  @Emit('open-modal')
  protected openModal(record: IVouchersRecord): IVouchersRecord {
    return record;
  }
}
</script>
