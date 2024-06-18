<template>
  <div
    class="bank-account-card"
    @click="bankAccountCardClickHandler">
    <div class="bank-account-card__header">
      <app-badge :status="statusLowerCase" />
      <div
        v-if="isAccountDefault"
        class="bank-account-card__default-label">
        {{ $t('pages.bank_accounts.default_bank_account') }}
      </div>
    </div>
    <bank-details-list :details-map="detailsListMap" />
  </div>
</template>

<script lang="ts">
import config from '@sdk5/shared/config';
import type { IBankAccountRecord } from '@sdk5/shared/requests';
import { AppBadge, AppBankDetailsList as BankDetailsList } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppBadge,
  BankDetailsList,
};
@Component({
  name: 'bank-account-card',
  components: COMPONENTS,
})
export default class BankAccountCard extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: Object as PropType<IBankAccountRecord>, required: true }) readonly bankAccount!: IBankAccountRecord;

  $props!: {
    bankAccount: IBankAccountRecord;
  };

  protected get isAccountDefault() {
    return this.bankAccount.default;
  }

  protected get statusLowerCase() {
    return this.bankAccount.status.toLowerCase();
  }

  protected get detailsListMap() {
    const { countryCode, bankAccountNumber, iban, bic, fullName } = this.bankAccount?.details ?? {};
    return new Map([
      ['form.label.country', countryCode ?? config.emptyChar],
      ['form.label.bank_account_number', bankAccountNumber ?? config.emptyChar],
      ['form.label.iban', iban ?? config.emptyChar],
      ['form.label.bic', bic ?? config.emptyChar],
      ['form.label.full_name', fullName ?? config.emptyChar],
    ]);
  }

  protected bankAccountCardClickHandler() {
    this.emitEditBankAccountEvent(this.bankAccount);
  }

  @Emit('edit')
  protected emitEditBankAccountEvent(bankAccount: IBankAccountRecord) {
    return bankAccount;
  }
}
</script>

<style lang="scss">
.bank-account-card {
  @apply p-[1.25rem] rounded-[8px] bg-gray-100 w-full flex flex-col gap-y-[1rem] cursor-pointer;

  box-shadow: 0 4px 12px 0 rgb(161 182 198 / 20%);

  &__header {
    @apply flex items-center justify-between;

    .badge {
      @apply p-0;
    }
  }

  &__default-label {
    @apply font-medium text-sm text-blue-600;
  }
}
</style>
