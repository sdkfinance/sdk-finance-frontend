<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns"
    :is-medium-font="true">
    <template #posCompanyName="{ scope: { row } }">
      <p class="column-name column-name--title">
        {{ row.posCompanyName }}
      </p>
      <p class="column-name column-name--subtitle">
        {{ row.description }}
      </p>
    </template>
    <template #active="{ scope: { row } }">
      <span v-if="row.active">{{ $t('table.label.active') }}</span>
      <span v-else>{{ $t('table.label.inactive') }}</span>
    </template>
    <template #action="{ scope: { row: { id } } }">
      <div class="table-actions">
        <app-button
          size="small"
          @click="getInfo(id)">
          {{ $t('action.view_details') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { ITableColumn } from '@/types/interfaces';
import config from '@/config';
import { IPointOfSaleRecord } from '@/services/requests/points-of-sale/PointsOfSale.types';

@Component({
  components: {
    AppTable,
    AppButton,
  },
})
export default class PointsOfSaleTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: IPointOfSaleRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  readonly emptyChar: string = config.emptyChar;

  readonly columns: ITableColumn[] = [
    {
      prop: 'posCompanyName',
      label: 'table.label.name',
      width: '400px',
    },
    {
      prop: 'website',
      label: 'table.label.website',
    },
    {
      prop: 'active',
      label: 'table.label.status',
      width: '120px',
    },
    {
      prop: 'action',
      label: 'table.label.action',
      width: '120px',
    },
  ];

  protected async getInfo(id: string): Promise<void> {
    await this.$router.push({ name: 'points-of-sale-transactions', params: { id } });
  }

}
</script>

<style lang="scss" scoped>
.column-name {
  font-size: 14px;
  margin: 0;

  &--title {
    color: #000;
  }

  &--subtitle {
    color: $text-light;
  }
}
</style>
