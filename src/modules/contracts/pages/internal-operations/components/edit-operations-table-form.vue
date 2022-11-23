<template>
  <app-table-form
    is-multiple
    :data="data"
    data-prop="operationsData"
    add-button-label="action.add_internal_operation"
    :is-loading="isLoading"
    :columns="columns">
    <template #processType="{scope}">
      <app-input
        v-model="scope.row.processType"
        size="small"/>
    </template>
  </app-table-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppTableForm from '@/components/ui-kit/app-table/app-table-form.vue';
import { ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppSelect,
    AppInput,
    AppTableForm,
  },
})
export default class EditOperationsTableForm extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'processType',
      label: 'table.label.internal_operation_name',
    },
    {
      prop: 'action',
      label: '',
      width: '50',
    },
  ]

}
</script>
