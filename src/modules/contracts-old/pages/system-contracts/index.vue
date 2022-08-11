<template>
  <contracts-layout :links="links">
    <contacts :default-filter="defaultFilter"/>
  </contracts-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ContractsLayout from '@/modules/contracts-old/layouts/contacts-layout.vue';
import Contacts from '@/modules/contracts-old/pages/contracts.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import {
  IContractsFilter,
} from '@/services/requests/contracts/Contracts.types';
import { CONTRACTS_CHILDREN } from '@/modules/contracts-old/routes';

@Component({
  components: {
    ContractsLayout,
    Contacts,
    AppButton,
  },
})
export default class ContractsMerchantPage extends Vue {

  protected defaultFilter: IContractsFilter = { types: ['system', 'gate_provider', 'cash_desk', 'payroll', 'exchanger'] };

  readonly links = CONTRACTS_CHILDREN.filter(({ meta }) => meta?.level === 1);

}
</script>
