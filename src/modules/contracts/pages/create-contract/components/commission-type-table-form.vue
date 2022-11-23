<template>
  <app-table-form
    is-multiple
    :data="data"
    data-prop="commissionData"
    :is-loading="isLoading"
    :columns="columns">
    <template #amountFrom="{scope}">
      <app-input
        v-model="scope.row.amountFrom"
        size="small"/>
    </template>
    <template #amountTo="{scope}">
      <app-input
        v-model="scope.row.amountTo"
        size="small"/>
    </template>
    <template #type="{scope}">
      <app-select
        v-model="scope.row.type"
        size="small"
        :options="['fixed', 'not-fixed']"/>
    </template>
    <template #fixed="{scope}">
      <app-input
        v-model="scope.row.fixed"
        size="small"/>
    </template>
    <template #percent="{scope}">
      <app-input
        v-model="scope.row.percent"
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
export default class CommissionTypeTableForm extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'amountFrom',
      label: 'table.label.amount_from',
    },
    {
      prop: 'amountTo',
      label: 'table.label.amount_to',
    },
    {
      prop: 'type',
      label: 'table.label.commission_type',
    },
    {
      prop: 'fixed',
      label: 'table.label.fixed',
    },
    {
      prop: 'percent',
      label: 'table.label.percent',
    },
    {
      prop: 'action',
      label: '',
      width: '50',
    },
  ]

}
</script>
