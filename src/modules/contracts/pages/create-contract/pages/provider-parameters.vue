<template>
  <div>
    <commission-type-table
      :data="commissionData"
      class="mb-24"/>
    <limit-type-table :data="limitData"/>
    <div class="flex justify-center mt-48">
      <app-button :to="{ name: 'create-contract-provider-service-settings-setup' }">
        {{ $t('action.setup_contract_commissions') }}
      </app-button>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import CommissionTypeTable from '@/modules/contracts/pages/create-contract/components/commission-type-table.vue';
import LimitTypeTable from '@/modules/contracts/pages/create-contract/components/limit-type-table.vue';
import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: { AppButton, LimitTypeTable, CommissionTypeTable },
})
export default class ProviderParameters extends Vue {

  protected commissionData = [
    {
      type: 'Fixed & percent',
      commission: '$1.50 + 1%',
    },
  ]

  protected limitData = [
    {
      type: 'Number of transactions',
      period: 'Per day',
      limits: '3',
    },
    {
      type: 'Number of transactions',
      period: 'Per week',
      limits: '10',
    },
    {
      type: 'Number of transactions',
      period: 'Per mounth',
      limits: '540',
    },
    {
      type: 'Amount of one transaction',
      period: '',
      limits: '10',
    },
  ]

}
</script>
