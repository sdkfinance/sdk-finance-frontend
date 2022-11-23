<template>
  <div>
    <div
      v-if="isBankAccountPending"
      class="action-container">
      <app-button
        size="small"
        @click.prevent="$emit('approve')">
        {{ $t('action.approve') }}
      </app-button>
      <app-button
        size="small"
        @click.prevent="$emit('reject')">
        {{ $t('action.reject') }}
      </app-button>
    </div>
    <details-list :details="mainInfoDetails"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import DetailsList from '@/components/details-list.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { IBankAccountRecord } from '@/services/requests/bank-accounts/BankAccounts.types';
import { IDetailsValue } from '@/types/interfaces';
import { getDefaultDate } from '@/utils';

@Component({
  components: {
    DetailsList,
    AppButton,
  },
})
export default class BankAccountsForm extends Vue {

  @Prop({ type: Object, required: true }) readonly formData!: IBankAccountRecord;

  protected get isBankAccountPending(): boolean {
    return this.formData.status === 'PENDING';
  }

  protected get mainInfoDetails(): IDetailsValue[] {
    return [
      {
        label: 'form.label.status',
        param: 'status',
        value: this.formData.status,
      },
      {
        label: 'form.label.created_at',
        param: 'createdAt',
        value: getDefaultDate(this.formData.createdAt),
      },
      {
        label: 'form.label.updated_at',
        param: 'updatedAt',
        value: getDefaultDate(this.formData.updatedAt),
      },
      {
        label: 'form.label.full_name',
        param: 'fullName',
        value: this.formData.details.fullName,
      },
      {
        label: 'form.label.iban',
        param: 'iban',
        value: this.formData.details.iban,
      },
      {
        label: 'form.label.account_number',
        param: 'details.account',
        value: this.formData.details.bankAccountNumber,
      },
      {
        label: 'form.label.bank_name',
        param: 'details.name',
        value: this.formData.details.name,
      },
      {
        label: 'form.label.bank_address',
        param: 'details.address',
        value: this.formData.details.address,
      },
      {
        label: 'form.label.bic',
        param: 'details.bic',
        value: this.formData.details.bic,
      },
      {
        label: 'form.label.swift',
        param: 'details.swift',
        value: this.formData.details.swift,
      },
    ];
  }

}
</script>

<style lang="scss">
.action-container {
  background: $grey-color;
  border: 1px solid #e4eaf3;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .el-button {
    width: 100%;
  }
}
</style>
