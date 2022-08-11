<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template #value="{scope}">
      <app-input
        v-model="scope.row.value"
        :rows="4"
        small-text
        type="textarea"/>
    </template>
    <template #action="{scope}">
      <app-button
        size="small"
        @click="updateValue(scope.row)">
        {{ $t('action.update') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import { ITableColumn, IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
    AppInput,
  },
})
export default class VariablesTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'key',
      label: 'table.label.name',
      width: '200',
    },
    {
      prop: 'type',
      label: 'table.label.type',
      width: '80',
    },
    {
      prop: 'value',
      label: 'table.label.value',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '110',
    },
  ];

  @Emit('updateValue')
  updateValue(value: IPlainObject): IPlainObject {
    return value;
  }

}
</script>
