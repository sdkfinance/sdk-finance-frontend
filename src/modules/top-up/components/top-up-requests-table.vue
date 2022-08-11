<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template
      #action="{ scope: { row } }">
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
import {
  Component,
  Emit,
  Prop,
  Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import { ITopUpRecord } from '@/services/requests/bank-top-ups/TopUp.types';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class TopUpRequestsTable extends Vue {

  @Prop({ default: '', type: Array }) readonly data!: ITopUpRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'fullName',
      label: 'table.label.name',
    },
    {
      prop: 'id',
      label: 'table.label.id',
    },
    {
      prop: 'type',
      label: 'table.label.type',
      width: '120px',
    },
    {
      prop: 'status',
      label: 'table.label.status',
      width: '120px',
    },
    {
      prop: 'createdAt',
      label: 'table.label.created_at',
      width: '200px',
      type: 'datetime',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ]

  @Emit('open-modal')
  protected openModal(record: ITopUpRecord): ITopUpRecord {
    return record;
  }

}
</script>
