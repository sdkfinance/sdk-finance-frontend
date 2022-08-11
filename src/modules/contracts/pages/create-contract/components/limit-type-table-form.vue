<template>
  <app-table-form
    :data="data"
    data-prop="limitData"
    :is-loading="isLoading"
    :columns="columns">
    <template #limits="{scope}">
      <app-input
        v-model="scope.row.limits"
        size="small"/>
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
export default class LimitTypeTableForm extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.limit_type',
      width: '230',
    },
    {
      prop: 'period',
      label: 'table.label.period',
    },
    {
      prop: 'limits',
      label: 'table.label.limits',
      width: '200',
    },
  ]

}
</script>
