<template>
  <app-table
    :data="data"
    :is-loading="isLoading"
    :columns="columns"
    is-secondary
    is-striped
    is-border-none/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

import AppTable from '@/components/ui-framework/app-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';

@Component({
  components: { AppBadge, AppButton, AppTable },
})
export default class CredentialsHistory extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  protected columns: ITableColumn[] = [
    {
      prop: 'type',
      label: 'table.label.type',
      sortable: true,
      width: '300',
    },
    {
      prop: 'date',
      label: 'table.label.date',
      sortable: true,
    },
  ]

  protected data: IPlainObject[] = [
    { type: 'Changed password', date: '22.06.2021 - 14:01:59' },
    { type: 'Changed login', date: '22.06.2021 - 14:01:59' },
  ]

}
</script>
