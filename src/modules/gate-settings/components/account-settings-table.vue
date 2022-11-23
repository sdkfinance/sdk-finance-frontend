<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :columns="columns">
    <template #value="{scope}">
      <app-input
        v-model="scope.row.value"
        :rows="1"
        size="small"
        small-text/>
    </template>
    <template #action="{scope}">
      <app-button
        size="small"
        @click="update(scope.row)">
        {{ $t('action.update') }}
      </app-button>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
    AppInput,
  },
})
export default class AccountSettingsTable extends Vue {

  @Prop({ default: '', type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'name',
      label: 'table.label.name',
      width: '200',
    },
    {
      prop: 'value',
      label: 'table.label.value',
    },
    {
      prop: 'action',
      label: '',
      width: '110',
    },
  ];

  @Emit('updateValue')
  update(value: IPlainObject): IPlainObject {
    return value;
  }

}
</script>
