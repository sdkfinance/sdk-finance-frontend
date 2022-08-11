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
          :to="{ name: 'create-contract-provider-service-settings', params: {id: $route.params.id }}"
          size="mini">
          {{ $t('action.add_commissions_and_limits') }}
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
export default class ProviderServicesTable extends Vue {

  @Prop({ default: () => [], type: Array }) private data!: [];

  @Prop({ default: false, type: Boolean }) private isLoading!: boolean;

  public columns: ITableColumn[] = [
    {
      prop: 'status',
      label: 'table.label.service_status',
      width: '120',
    },
    {
      prop: 'service',
      label: 'table.label.service',
    },
    {
      prop: 'action',
      label: '',
      width: '250px',
    },
  ]

}
</script>
