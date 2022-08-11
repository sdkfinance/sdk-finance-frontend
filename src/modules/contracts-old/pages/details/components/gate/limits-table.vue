<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
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

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class LimitsTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'txType',
      label: 'table.label.transaction_type',
    },
    {
      prop: 'qualifier',
      label: 'table.label.qualifier',
      localePrefix: 'entity.qualifier',
    },
    {
      prop: 'value',
      label: 'table.label.value',
    },
    {
      prop: 'timeUnit',
      label: 'table.label.time_unit',
      localePrefix: 'entity.time_unit',
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

}
</script>
