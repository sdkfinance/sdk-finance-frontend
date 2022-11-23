<template>
  <app-form
    ref="form"
    :loading="isLoading"
    :model="form"
    class="pending-invoice-form"
    :rules="rules">
    <app-form-item
      prop="payerCoin">
      <account-select
        v-model="form.payerCoin"
        size="medium"
        :disabled="isNoAvailableAccounts"
        :placeholder="accountPlaceholder"
        :coins="availableAccountList"
        label="form.label.choose_account"/>
    </app-form-item>
    <div class="pending-invoice-form__controls">
      <app-button
        outlined
        type="secondary"
        full-width
        @click.prevent="rejectForInvoice">
        {{ $t('action.reject') }}
      </app-button>
      <app-button
        type="secondary"
        full-width
        :disabled="isNoAvailableAccounts"
        @click.prevent="payForInvoice">
        {{ $t('action.pay') }}
      </app-button>
    </div>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AccountSelect from '@/modules/user-dashboard/components/account-select.vue';
import { OnChangeRequiredValidationRule } from '@/rules/validation';
import { InvoicesRequests } from '@/services/requests';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { UserCoins } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

interface IForm {
  payerCoin: IPlainObject;
}

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppSelect,
    AppButton,
    AccountSelect,
  },
})
export default class PendingInvoiceForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: String, default: '' }) readonly invoiceCurrency!: string;

  @Prop({ type: String, default: '' }) readonly invoiceIdentifier!: string;

  @Emit('invoice-payed')
  onInvoicePayed<T>(payload?: T): T | undefined {
    return payload;
  }

  @Emit('invoice-rejected')
  onInvoiceRejected<T>(payload?: T): T | undefined {
    return payload;
  }

  protected isLoading: boolean = false;

  protected form: IForm = {
    payerCoin: {},
  };

  protected rules: IPlainObject = {
    payerCoin: OnChangeRequiredValidationRule(),
  }

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected get accountList(): ICoin[] {
    return this.userCoinsModule.coinList;
  }

  protected async payForInvoice(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;

    const { error } = await InvoicesRequests.payForInvoice(
      { payerCoin: this.form.payerCoin.serial },
      this.invoiceIdentifier,
    );

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onInvoicePayed();
  }

  protected async rejectForInvoice(): Promise<void> {
    this.isLoading = true;

    const { error } = await InvoicesRequests.deleteInvoice(this.invoiceIdentifier);

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onInvoiceRejected();
  }

  protected get isNoAvailableAccounts(): boolean {
    return this.availableAccountList.length === 0;
  }

  protected get availableAccountList(): ICoin[] {
    return this.accountList
      .filter((account: ICoin) => account?.issuer?.currency === this.invoiceCurrency);
  }

  protected get accountPlaceholder(): any {
    const noAvailableCurrencyString = this.$t('placeholder.select.no_available_currency_account', { currency: this.invoiceCurrency });

    return this.isNoAvailableAccounts
      ? noAvailableCurrencyString
      : this.$t('placeholder.select.choose_account');
  }

}
</script>

<style lang="scss">
.pending-invoice-form {
  @apply m-0 w-full;

  &__controls {
    @apply flex;
  }

  &__select {
    @apply text-blue-700;
  }
}
</style>
