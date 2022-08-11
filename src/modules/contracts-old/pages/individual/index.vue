<template>
  <contracts-layout :links="links">
    <template #action>
      <app-button
        size="small"
        @click="toggleModal">
        {{ $t('action.add_custom_contract') }}
      </app-button>
    </template>
    <contacts :default-filter="defaultFilter">
      <template #default="{ contractsList, isLoading, updateTable }">
        <modal
          v-model="isModalShow"
          title="'pages.contracts.modal.add_custom_contract_for_individuals'"
          width="380px">
          <custom-contract-form
            :contracts-list="contractsList"
            :is-loading-data="isLoading"
            @submit="toggleModal(); updateTable();"/>
        </modal>
      </template>
    </contacts>
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
import Modal from '@/components/modal.vue';
import CustomContractForm from '@/modules/contracts-old/components/custom-contract-form.vue';

@Component({
  components: {
    ContractsLayout,
    Contacts,
    AppButton,
    Modal,
    CustomContractForm,
  },
})
export default class ContractsIndividualPage extends Vue {

  protected defaultFilter: IContractsFilter = { types: ['individual'] };

  protected isModalShow: boolean = false;

  readonly links = CONTRACTS_CHILDREN.filter(({ meta }) => meta?.level === 1);

  protected toggleModal(): void {
    this.isModalShow = !this.isModalShow;
  }

}
</script>
