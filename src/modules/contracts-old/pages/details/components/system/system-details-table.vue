<template>
  <app-table-form
    is-multiple
    :data="commissionData"
    data-prop="conditions"
    :is-loading="isLoading"
    :columns="columns"
    v-on="$listeners">
    <template #beginAmount="{scope}">
      <app-input
        v-model="scope.row.beginAmount"
        :disabled="!scope.row.isEditing"
        size="small"/>
    </template>
    <template #endAmount="{scope}">
      <app-input
        v-model="scope.row.endAmount"
        :disabled="!scope.row.isEditing"
        size="small"/>
    </template>
    <template #value.type="{scope}">
      <app-select
        v-model="scope.row.value.type"
        :disabled="!scope.row.isEditing"
        option-label="label"
        option-value="value"
        size="small"
        :options="COMMISSION_TYPES_ARRAY"/>
    </template>
    <template #value.valueFixed="{scope}">
      <app-input
        v-model="scope.row.value.valueFixed"
        :disabled="!scope.row.isEditing || scope.row.value.type === 'percent' || scope.row.value.type === 'zero'"
        size="small"/>
    </template>
    <template #value.valuePercent="{scope}">
      <app-input
        v-model="scope.row.value.valuePercent"
        :disabled="!scope.row.isEditing || scope.row.value.type === 'fixed' || scope.row.value.type === 'zero'"
        size="small"/>
    </template>
  </app-table-form>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { ITableColumn } from '@/types/interfaces';
import AppTableForm from '@/components/ui-kit/app-table/app-table-form.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { COMMISSION_TYPES_ARRAY } from '@/constants';

@Component({
  components: {
    AppTableForm,
    AppInput,
    AppSelect,
  },
})
export default class SystemDetailsTable extends Vue {

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ default: () => [], type: Array }) readonly commissionData!: [];

  protected COMMISSION_TYPES_ARRAY = COMMISSION_TYPES_ARRAY;

  protected columns: ITableColumn[] = [
    {
      prop: 'beginAmount',
      label: 'table.label.amount_from',
    },
    {
      prop: 'endAmount',
      label: 'table.label.amount_to',
    },
    {
      prop: 'value.type',
      label: 'table.label.commission_type',
    },
    {
      prop: 'value.valueFixed',
      label: 'table.label.fixed',
    },
    {
      prop: 'value.valuePercent',
      label: 'table.label.percent',
    },
    {
      prop: 'action',
      label: '',
      width: '85',
    },
  ]

}
</script>
