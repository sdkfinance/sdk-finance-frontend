<template>
  <app-table
    is-secondary
    is-striped
    is-border-none
    is-small-font
    :data="data"
    :is-loading="isLoading"
    :columns="columns">
    <template #status="{scope}">
      <app-switch
        v-model="scope.row.status"
        secondary/>
    </template>
    <template
      #action>
      <div class="table-actions">
        <app-button
          :to="{ name: 'create-contract-provider-services', params: { id: 'test' } }"
          size="mini">
          {{ $t('action.view_services_list') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppTable from '@/components/ui-framework/app-table.vue';
import { ITableColumn } from '@/types/interfaces';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';

@Component({
  components: {
    AppSwitch,
    AppTable,
    AppButton,
  },
})
export default class ProvidersTable extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'status',
      label: 'table.label.provider_status',
    },
    {
      prop: 'provider',
      label: 'table.label.provider',
    },
    {
      prop: 'services',
      label: 'table.label.services',
    },
    {
      prop: 'commission',
      label: 'table.label.added_commissions',
      width: '160',
    },
    {
      prop: 'currency',
      label: 'table.label.currency',
    },
    {
      prop: 'action',
      label: '',
      width: '170px',
    },
  ]

}
</script>
