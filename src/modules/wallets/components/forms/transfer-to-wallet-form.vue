<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <template v-if="!isRepeat">
      <app-form-item
        prop="senderCoin">
        <app-select
          v-model="form.senderCoin"
          :options="coinsList"
          option-label="name"
          option-value="serial"
          placeholder="placeholder.select.choose_wallet"
          full-width
          label="form.label.from_wallet"
          @change="onMainChange"/>
      </app-form-item>
      <app-form-item
        prop="isFromContacts">
        <app-select
          v-model="form.walletType"
          :options="walletMethodList"
          option-label="label"
          option-value="value"
          placeholder="placeholder.select.choose_wallet_method"
          full-width
          label="form.label.wallet_methods"
          @change="onMainChange"/>
      </app-form-item>
      <app-form-item
        v-if="isWalletMethodContacts"
        prop="currentContact">
        <app-select
          v-model="form.currentContact"
          :options="contactsList"
          value-key="id"
          :disabled="!currencyCode"
          :option-label="({firstName, nickname, lastName}) => `${firstName || nickname} ${lastName || ''}`"
          placeholder="placeholder.select.choose_contact"
          full-width
          label="form.label.contacts"
          @change="onContactChange"/>
      </app-form-item>
      <app-form-item
        v-else-if="isWalletMethodWalletNumber"
        prop="recipientCoin">
        <app-input
          v-model="form.recipientCoin"
          placeholder="placeholder.input.input_wallet_serial"
          label="form.label.recipient_wallet"
          @blur="calculateCommissionFee"/>
      </app-form-item>
      <app-form-item
        v-else-if="isWalletMethodEmailOrPhone"
        prop="login">
        <app-input
          v-model="form.login"
          :disabled="!currencyCode"
          placeholder="placeholder.input.input_email_or_phone"
          label="form.label.email_or_phone"
          @blur="getWalletByLogin(form.login)"/>
      </app-form-item>
      <app-form-item prop="amount">
        <app-input
          v-model="form.amount"
          placeholder="placeholder.input.input_amount"
          label="form.label.amount"
          @input="clearCommission"
          @blur="calculateCommissionFee"/>
      </app-form-item>
      <app-form-item prop="description">
        <app-input
          v-model="form.description"
          :rows="2"
          type="textarea"
          placeholder="placeholder.input.add_transfer_details"
          label="form.label.description"/>
      </app-form-item>
      <app-form-item prop="active">
        <app-switch
          v-model="isSaveTemplate"
          label="form.label.save_as_template"/>
      </app-form-item>
      <app-form-item
        v-if="isSaveTemplate"
        prop="name">
        <app-input
          v-model="form.name"
          placeholder="placeholder.input.input_template_name"
          label="form.label.template_name"/>
      </app-form-item>
    </template>
    <div
      v-if="commission.status"
      class="form__list">
      <p>
        <strong>{{ $t('pages.wallets.recipient') }}: </strong>
        {{ recipientWallet.name }}
      </p>
      <p>
        <strong>{{ $t('pages.wallets.commission_amount') }}: </strong>
        {{ commission.commissionAmountPush }} {{ commission.issuer.currency }}
      </p>
      <p>
        <strong>{{ $t('pages.wallets.the_amount_in_view_of_commission') }}: </strong>
        {{ commission.recipientAmountPush }} {{ commission.issuer.currency }}
      </p>
    </div>
    <app-button
      v-if="isCalculateButtonVisible"
      type="primary"
      full-width
      native-type="button"
      @click="calculateCommissionFee">
      {{ $t('action.next') }}
    </app-button>
    <app-button
      v-else
      type="primary"
      :disabled="isSubmitButtonDisabled"
      native-type="submit"
      full-width>
      {{ $t('action.top_up') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import { LocaleMessage } from 'vue-i18n';
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import {
  EmailOrPhoneValidationRule,
  OnChangeRequiredValidationRule,
  SimpleNumberRangeValidationRule,
  SimpleRequiredValidationRule,
} from '@/rules/validation';
import { TransfersRequests, WalletsRequests } from '@/services/requests';
import { IWalletRecord } from '@/services/requests/coins/Wallets.types';
import { IContactRecord } from '@/services/requests/contact-book/Contacts.types';
import { ContactsRequests } from '@/services/requests/contact-book/ContactsRequests';
import { IPaymentProviderRecord } from '@/services/requests/gate/Gate.types';
import { ITransferTemplateRecord } from '@/services/requests/templates/Templates.types';
import { TemplatesRequests } from '@/services/requests/templates/TemplatesRequests';
import { ITransferBody, ITransferCalculateResponse } from '@/services/requests/transfers/Transfers.types';
import { CatalogModule } from '@/store/modules/dynamic';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

interface IForm {
  name: string;
  recipientCoin: string;
  senderCoin: string;
  amount: number | null;
  description: string;
  walletType: number | null;
  currentContact: IContactRecord | null;
  login: String | null;
}

enum walletTypes {
  contacts,
  walletNumber,
  emailOrPhone,
}

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppSwitch,
    AppButton,
  },
})
export default class TransferToWalletForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, default: () => ([]) }) readonly coinsList!: IWalletRecord[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: ITransferTemplateRecord;

  @Prop({ type: Boolean, default: false }) readonly isRepeat!: boolean;

  protected isLoading: boolean = false;

  protected isSaveTemplate: boolean = false;

  protected recipientWallet: { name: string; valid: boolean } = { name: '', valid: false };

  protected commission: Partial<ITransferCalculateResponse> = {};

  protected contactsList: IContactRecord[] = [];

  protected walletMethodList: { label: LocaleMessage; value: number }[] = [
    {
      label: this.$t('form.label.from_my_contacts'),
      value: walletTypes.contacts,
    },
    {
      label: this.$t('form.label.wallet_number'),
      value: walletTypes.walletNumber,
    },
    {
      label: this.$t('form.label.email_or_phone'),
      value: walletTypes.emailOrPhone,
    },
  ];

  protected form: IForm= {
    name: '',
    recipientCoin: '',
    senderCoin: '',
    amount: null,
    description: '',
    login: '',
    walletType: null,
    currentContact: null,
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    recipientCoin: SimpleRequiredValidationRule(),
    senderCoin: OnChangeRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
    walletMethod: OnChangeRequiredValidationRule(),
    currentContact: OnChangeRequiredValidationRule(),
    login: EmailOrPhoneValidationRule(true),
  }

  protected get paymentProviderList(): IPaymentProviderRecord[] {
    return CatalogModule.paymentProviderList;
  }

  protected get isFormLoading(): boolean {
    return this.isLoadingData || this.isLoading;
  }

  protected get isSubmitButtonDisabled(): boolean {
    return !this.commission.status || !this.recipientWallet.valid;
  }

  protected get isCalculateButtonVisible(): boolean {
    return !this.commission.status;
  }

  protected get currencyCode(): string {
    return this.coinsList.find(({ serial }) => serial === this.form.senderCoin)?.issuer?.currency || '';
  }

  protected get isWalletMethodContacts(): boolean {
    return this.form.walletType === walletTypes.contacts;
  }

  protected get isWalletMethodWalletNumber(): boolean {
    return this.form.walletType === walletTypes.walletNumber;
  }

  protected get isWalletMethodEmailOrPhone(): boolean {
    return this.form.walletType === walletTypes.emailOrPhone;
  }

  protected created(): void {
    this.fetchContacts();
    if (this.isRepeat) {
      const {
        name,
        amount,
        description,
        senderCoin: { serial: senderCoin },
        recipientCoin: { serial: recipientCoin },
      } = this.formData;

      this.form = {
        name,
        amount,
        description,
        senderCoin,
        recipientCoin,
        walletType: null,
        login: '',
        currentContact: null,
      };
    }
  }

  async mounted() {
    if (this.isRepeat) {
      await this.calculateCommissionFee();
    }
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async createTemplate(): Promise<boolean> {
    const {
      paymentTool,
      amount,
      description,
    } = this.getSendData(this.form);
    const { name } = this.form;

    const { error } = await TemplatesRequests.createTemplateTransfer({
      name,
      paymentTool,
      amount,
      description,
    });

    if (error) {
      errorNotification(error);
      return false;
    }

    return true;
  }

  protected async validateWallet(serial: string): Promise<void> {
    const { response, error } = await WalletsRequests.validateWallet(serial);
    if (error) {
      errorNotification(error);
      this.recipientWallet.name = '';
      this.recipientWallet.valid = false;
      return;
    }

    this.recipientWallet.name = response?.owner.name || '';
    this.recipientWallet.valid = true;
  }

  protected async calculateCommissionFee(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const sendData = this.getSendData(this.form);
    const { response, error } = await TransfersRequests.calculateCommissionFee(sendData);
    await this.validateWallet(this.form.recipientCoin);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.commission = {};
      return;
    }

    if (!response) {
      return;
    }

    this.commission = response;
  }

  protected onContactChange(contact: IContactRecord): void {
    this.getWalletByLogin(contact.email || contact.phoneNumber);
  }

  protected async getWalletByLogin(login: string): Promise<void> {
    this.clearCommission();

    const { response, error } = await WalletsRequests.getWalletByLogin({
      login,
      currencyCode: this.currencyCode,
    });

    if (error) {
      errorNotification(error);
      this.form.currentContact = null;
      this.form.login = null;
    }

    this.form.recipientCoin = response?.serial || '';
  }

  protected async fetchContacts(): Promise<void> {
    const { response, error } = await ContactsRequests.getALLRecords();
    if (error) {
      errorNotification(error);
      return;
    }
    this.contactsList = response?.contacts || [];
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    if (this.isSaveTemplate) {
      const saved = await this.createTemplate();
      if (!saved) return;
    }

    this.isLoading = true;
    const sendData = this.getSendData(this.form);
    const { error } = await TransfersRequests.executeTransfer(sendData);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }

  protected clearCommission() {
    this.commission = {};
  }

  protected getSendData(form: IForm): ITransferBody {
    const {
      recipientCoin,
      senderCoin,
      amount,
      description,
    } = form;

    return {
      paymentTool: {
        type: 'COIN',
        destValue: recipientCoin,
        srcValue: senderCoin,
      },
      amount,
      description,
    };
  }

  protected async onMainChange(): Promise<void> {
    await this.$nextTick();
    this.clearCommission();
    this.form.currentContact = null;
    if (this.form.walletType !== walletTypes.walletNumber) {
      this.form.recipientCoin = '';
    }
  }

}
</script>
