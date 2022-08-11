<template>
  <div class="commission-column">
    <template v-if="data.length">
      <div><strong>{{ $t('table.label.provider') }}: </strong>{{ getCommission('PROVIDER') }}</div>
      <div><strong>{{ $t('table.label.total') }}: </strong>{{ getCommission('TOTAL') }}</div>
      <div class="table-status">
        <span v-if="active">{{ $t('table.label.active') }}</span>
        <span v-else>{{ $t('table.label.inactive') }}</span>
      </div>
    </template>
    <template v-else>
      {{ $t('table.empty_text') }}
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ICommissionSettingRecord } from '@/services/requests/contracts/Commissions.types';

@Component
export default class CommissionColumn extends Vue {

  @Prop({ required: true, type: Array }) private data!: ICommissionSettingRecord[];

  @Prop({ default: '', type: String }) private currency!: string;

  protected active: boolean = false;

  protected empty: boolean = false;

  protected getCommission(type: string): string {
    const currentCommission: ICommissionSettingRecord | undefined = this.data.find(({ collector }) => collector === type);

    if (!currentCommission) {
      return '';
    }

    type TCommission = Pick<ICommissionSettingRecord, 'active' | 'value'> ;
    const { active, value }: TCommission = currentCommission;

    this.active = active;

    if ('valuePercent' in value && 'valueFixed' in value) {
      return `${value.valuePercent}% ${this.$t('table.label.and')} ${value.valueFixed} ${this.currency}`;
    }
    if ('valuePercent' in value) {
      return `${value.valuePercent}%`;
    }
    if ('valueFixed' in value) {
      return `${value.valueFixed} ${this.currency}`;
    }

    return '0';
  }

}
</script>

<style lang="scss">
  .commission-column {
    line-height: 1.6;
  }
</style>
