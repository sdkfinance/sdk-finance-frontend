<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <template v-if="currentStep === formSteps.voucher">
      <app-form-item prop="serial">
        <app-input
          v-model="form.serial"
          label="pages.vouchers.voucher_number"
          placeholder="pages.vouchers.voucher_number"
          clearable/>
      </app-form-item>

      <app-button
        class="btn-submit"
        full-width
        type="primary"
        @click.prevent="fetchViewPrepaidVoucher">
        {{ $t('action.continue') }}
      </app-button>
    </template>

    <template v-if="currentStep === formSteps.pin">
      <div class="form__list">
        <p>
          <strong>{{ $t('pages.vouchers.voucher_amount') }}: </strong>
          {{ commissions.amount }} {{ commissions.currency }}
        </p>
      </div>

      <app-form-item prop="prepaidPin">
        <app-input
          v-model="form.prepaidPin"
          label="pages.vouchers.voucher_pin"
          placeholder="pages.vouchers.voucher_pin"
          clearable/>
      </app-form-item>

      <button
        class="dotted button-as-text forgot-pin"
        @click.prevent="">
        {{ $t('pages.vouchers.forgot_pin') }}
      </button>

      <app-button
        class="btn-submit"
        full-width
        type="primary"
        @click.prevent="calculateCommission">
        {{ $t('action.continue') }}
      </app-button>
    </template>

    <template v-if="currentStep === formSteps.commission">
      <div class="form__list">
        <p>
          <strong>{{ $t('pages.vouchers.voucher_amount') }}: </strong>
          {{ commissions.amount }} {{ commissions.currency }}
        </p>
        <p>
          <strong>{{ $t('pages.contracts.navigation.system_commission') }}: </strong>
          {{ commissions.system }} {{ commissions.currency }}
        </p>
        <p>
          <strong>{{ $t('pages.vouchers.view_amount_commission') }}: </strong>
          {{ commissions.view }} {{ commissions.currency }}
        </p>
      </div>

      <app-button
        class="btn-submit"
        full-width
        native-type="submit"
        type="primary">
        {{ $t('action.redeem') }}
      </app-button>
    </template>

    <template v-if="currentStep === formSteps.activated">
      <div class="form__list">
        <p>
          <strong>{{ $t('pages.vouchers.voucher_number') }}: </strong>
          {{ voucherActivatedData.serial }}
        </p>
        <p>
          <strong>{{ $t('pages.vouchers.voucher_amount') }}: </strong>
          {{ voucherActivatedData.amount }} {{ commissions.currency }}
        </p>
      </div>
    </template>
  </app-form>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Ref,
  Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { VouchersRequests, WalletsRequests } from '@/services/requests';
import { SimpleRequiredValidationRule, SimpleNumberValidationRule } from '@/rules/validation';
import { errorNotification } from '@/utils';
import { IVoucherRedeem, IPostVoucherRedeemForm } from '@/services/requests/prepaid-coins/Vouchers.interface';
import { IPlainObject } from '@/types/interfaces';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';

const formStepsList = {
  voucher: 'voucher',
  pin: 'pin',
  commission: 'commission',
  activated: 'activated',
};

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class VouchersFormRedeem extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Emit('voucherActivated')
  updateRedeemModalTitle() {}

  @Emit('close')
  closeModal(): void {}

  protected rules: IPlainObject = {
    serial: SimpleNumberValidationRule(),
    prepaidPin: SimpleRequiredValidationRule(),
  };

  protected isLoading: boolean = false;

  protected currentStep: keyof typeof formStepsList = 'voucher';

  protected formSteps: IPlainObject = formStepsList;

  protected coinsData: IWalletRecord[] = [];

  protected prepaidVoucherId?: string | null = null;

  protected form: IPostVoucherRedeemForm = {
    serial: '',
    prepaidPin: '',
  };

  protected commissions: IPlainObject = {
    amount: null,
    system: null,
    view: null,
    currency: null,
  }

  protected voucherActivatedData: IVoucherRedeem = {
    amount: null,
    serial: null,
  };

  protected created() {
    this.fetchWallets();
  }

  protected async fetchViewPrepaidVoucher(): Promise<void> {
    const { serial } = this.form;

    this.isLoading = true;
    const { response, error } = await VouchersRequests.viewPrepaidVoucher(serial);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.prepaidVoucherId = response?.issuer?.id;

    this.commissions.amount = response?.amount;
    this.commissions.currency = response?.issuer?.currency;

    this.currentStep = this.formSteps.pin;
  }

  protected async fetchWallets(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await WalletsRequests.getWallets();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.coinsData = response?.coins || [];
  }

  protected get destSerial(): string | null {
    return this.coinsData.find((coin) => coin.issuer.id === this.prepaidVoucherId)?.serial || null;
  }

  protected async calculateCommission(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    if (!this.destSerial) {
      errorNotification('notification.no_wallets_with_such_currency');
      this.closeModal();
      return;
    }

    const {
      prepaidPin,
      serial,
    } = this.form;

    const payload = {
      destSerial: this.destSerial,
      prepaidPin,
    };

    this.isLoading = true;
    const { response, error } = await VouchersRequests.calculateVoucherRedeemCommission(payload, serial);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.currentStep = this.formSteps.commission;

    this.commissions.amount = response?.transactionAmount.toFixed(2);
    this.commissions.system = response?.commissionAmountPush.toFixed(2);
    this.commissions.view = response?.recipientAmountPush.toFixed(2);
    this.commissions.currency = response?.issuer.currency;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    const {
      prepaidPin,
      serial,
    } = this.form;

    const payload = {
      destSerial: this.destSerial!,
      prepaidPin,
    };

    this.isLoading = true;
    const { response, error } = await VouchersRequests.redeemVoucher(payload, serial);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.voucherActivatedData = {
      amount: response?.process.amount.toFixed(2) || null,
      serial: String(response?.process.from.serial) || null,
    };

    this.currentStep = this.formSteps.activated;
    this.updateRedeemModalTitle();
  }

}
</script>

<style lang="scss" scoped>
.forgot-pin {
  margin-bottom: 16px;
}
</style>
