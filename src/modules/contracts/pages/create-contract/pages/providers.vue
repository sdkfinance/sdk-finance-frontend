<template>
  <providers-table
    :data="providersList"
    :is-loading="isLoading"/>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import ProvidersTable from '@/modules/contracts/pages/create-contract/components/providers-table.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: { ProvidersTable },
})
export default class Providers extends Vue {

  protected isLoading: boolean = false;

  protected providersList: IPlainObject[] = [
    {
      status: true,
      provider: 'Easypay',
      services: 156,
      commission: 0,
      currency: 'USD',
    },
    {
      status: false,
      provider: 'QIWI',
      services: 16,
      commission: 0,
      currency: 'USD',
    },
    {
      status: true,
      provider: 'Portmone',
      services: 148,
      commission: 10,
      currency: 'EUR',
    },
  ]

}
</script>
