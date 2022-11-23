<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <template v-if="!isVoucherCreated">
      <app-form-item prop="srcSerial">
        <app-select
          v-model="form.srcSerial"
          clearable
          full-width
          label="pages.vouchers.voucher_wallet"
          placeholder="pages.vouchers.voucher_wallet"
          :options="coinList"
          option-label="issuer.currency"
          option-value="serial"/>
      </app-form-item>

      <app-form-item prop="prepaidAmount">
        <app-input
          v-model="form.prepaidAmount"
          label="pages.vouchers.voucher_amount"
          placeholder="pages.vouchers.voucher_amount"
          clearable/>
      </app-form-item>

      <div v-if="hasCommission">
        <div class="form__list">
          <p>
            <strong>{{ $t('pages.contracts.navigation.system_commission') }}: </strong>
            {{ commissions.system }} {{ commissions.currency }}
          </p>
          <p>
            <strong>{{ $t('pages.vouchers.view_amount_commission') }}: </strong>
            {{ commissions.view }} {{ commissions.currency }}
          </p>
        </div>
      </div>

      <app-button
        v-if="hasCommission"
        class="btn-submit"
        full-width
        type="primary">
        {{ $t('action.create') }}
      </app-button>
      <app-button
        v-else
        class="btn-submit"
        full-width
        type="primary"
        @click.prevent="calculateCommission">
        {{ $t('pages.vouchers.calculate_commission') }}
      </app-button>
    </template>
    <template v-else>
      <div class="form__list">
        <p class="voucher-affirm">
          <strong>{{ $t('pages.vouchers.view_created_affirm_subtitle') }}</strong>
        </p>
        <p><strong>{{ $t('pages.vouchers.voucher_number') }}: </strong>{{ voucherData.number }}</p>
        <p><strong>{{ $t('pages.vouchers.pin') }}: </strong>{{ voucherData.pin }}</p>
        <p><strong>{{ $t('pages.vouchers.voucher_amount') }}: </strong>{{ voucherData.amount }} {{ commissions.currency }}</p>
      </div>
    </template>
  </app-form>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Ref,
  Vue, Watch,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { SimpleNumberValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { VouchersRequests, WalletsRequests } from '@/services/requests';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import { IVoucherCreated, IVoucherNew } from '@/services/requests/prepaid-coins/Vouchers.interface';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppSelect,
    AppInput,
    AppButton,
  },
})
export default class VouchersFormAdd extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Emit('voucherCreated')
  onVoucherCreated() {}

  protected isLoading: boolean = false;

  protected isVoucherCreated: boolean = false;

  protected rules: IPlainObject = {
    srcSerial: SimpleRequiredValidationRule(),
    prepaidAmount: SimpleNumberValidationRule(),
  };

  protected form: IVoucherNew = {
    srcSerial: '',
    prepaidAmount: 0,
  }

  @Watch('form', { deep: true })
  protected async resetCommission() {
    this.commissions = { system: '', view: '', currency: '' };
  }

  protected coinList: IWalletRecord[] = [];

  protected commissions: IPlainObject = {
    system: null,
    view: null,
    currency: null,
  }

  protected voucherData: IVoucherCreated = {
    amount: null,
    number: null,
    pin: null,
  };

  protected get isVoucherData(): boolean {
    return Object.values(this.voucherData).every((i) => i);
  }

  protected get hasCommission(): boolean {
    return Object.values(this.commissions).every((i) => i);
  }

  created() {
    this.fetchWallets();
  }

  protected async fetchWallets(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await WalletsRequests.getWallets();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.coinList = response?.coins || [];
  }

  protected async calculateCommission(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await VouchersRequests.calculateVoucher(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.commissions.system = response?.commissionAmountPush.toFixed(2);
    this.commissions.view = response?.recipientAmountPush.toFixed(2);
    this.commissions.currency = response?.issuer.currency;

  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await VouchersRequests.creatVoucher(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();

    this.voucherData.pin = response?.pin || null;
    this.voucherData.amount = response?.coin?.amount || null;
    this.voucherData.number = response?.coin?.serial || null;

    this.onVoucherCreated();
    this.isVoucherCreated = true;
  }

}
</script>

<style lang="scss" scoped>
  .voucher-affirm {
    margin-bottom: 35px;
  }
</style>
