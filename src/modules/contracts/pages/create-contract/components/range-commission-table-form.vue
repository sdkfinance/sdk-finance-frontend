<template>
  <app-table-form
    :data="data"
    data-prop="rangeData"
    :is-loading="isLoading"
    :columns="columns">
    <template #minAmount="{scope}">
      <app-input
        v-model="scope.row.minAmount"
        size="small"/>
    </template>
    <template #maxAmount="{scope}">
      <app-input
        v-model="scope.row.maxAmount"
        size="small"/>
    </template>
    <template #space>
      <span/>
    </template>
  </app-table-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ITableColumn } from '@/types/interfaces';
import AppTableForm from '@/components/ui-kit/app-table/app-table-form.vue';
import AppInput from '@/components/ui-framework/app-input.vue';

@Component({
  components: {
    AppInput,
    AppTableForm,
  },
})
export default class RangeCommissionTableForm extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'minAmount',
      label: 'table.label.min_commission_amount',
      width: '200',
    },
    {
      prop: 'maxAmount',
      label: 'table.label.max_commission_amount',
      width: '200',
    },
    {
      prop: 'space',
      label: '',
    },
  ]

}
</script>
