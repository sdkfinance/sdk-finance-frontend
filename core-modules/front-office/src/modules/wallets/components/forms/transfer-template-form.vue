<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="isUpdate"
      prop="delete">
      <button
        type="button"
        class="dotted button-as-text"
        @click.prevent="deleteButtonClickHandler">
        {{ $t('action.delete_template') }}
      </button>
    </app-form-item>
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_template_name"
        label="form.label.template_name" />
    </app-form-item>
    <app-form-item prop="paymentTool.srcValue">
      <app-select
        v-model="form.paymentTool.srcValue"
        :size="APP_SELECT_SIZE.large"
        :options="coinsList"
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.choose_wallet"
        full-width
        label="form.label.from_wallet" />
    </app-form-item>
    <app-form-item prop="paymentTool.destValue">
      <app-input
        v-model="form.paymentTool.destValue"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_wallet_serial"
        label="form.label.recipient_wallet" />
    </app-form-item>
    <app-form-item prop="amount">
      <app-input
        v-model="form.amount"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_amount"
        label="form.label.amount" />
    </app-form-item>
    <app-form-item prop="description">
      <app-input
        v-model="form.description"
        :rows="2"
        :size="APP_INPUT_SIZE.large"
        type="textarea"
        placeholder="placeholder.input.add_transfer_details"
        label="form.label.description" />
    </app-form-item>

    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ submitButtonText }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
// TODO: KEEP
import type { IWalletRecord } from '@sdk5/shared/requests';
import { Catalog } from '@sdk5/shared/store';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleNumberRangeValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { APP_INPUT_SIZE, APP_SELECT_SIZE, AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import type { ITransferTemplateBody, ITransferTemplateRecord } from '../../../../requests';
import { TemplatesRequests } from '../../../../requests';

const COMPONENTS = {
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
  AppButton,
} as const;

@Component({
  name: 'transfer-template-form',
  components: COMPONENTS,
})
export default class TransferTemplateForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Array as PropType<IWalletRecord[]>, default: () => [] }) readonly coinsList!: IWalletRecord[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  @Prop({ type: Object as PropType<ITransferTemplateRecord>, default: () => ({}) }) readonly formData!: ITransferTemplateRecord;

  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean;

  $props!: {
    coinsList?: IWalletRecord[];
    isLoadingData?: boolean;
    formData?: ITransferTemplateRecord | null;
    isUpdate?: boolean;
  };

  protected readonly APP_INPUT_SIZE = APP_INPUT_SIZE;

  protected readonly APP_SELECT_SIZE = APP_SELECT_SIZE;

  protected catalogModule = getModule(Catalog, this.$store);

  protected isLoading: boolean = false;

  protected id: string = '';

  protected get paymentProviderList() {
    return this.catalogModule.paymentProviderList;
  }

  protected form: ITransferTemplateBody = {
    name: '',
    paymentTool: {
      type: 'COIN',
      destValue: '',
      srcValue: '',
    },
    amount: null,
    description: '',
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    paymentTool: {
      destValue: SimpleRequiredValidationRule(),
      srcValue: OnChangeRequiredValidationRule(),
    },
    amount: SimpleNumberRangeValidationRule(),
  };

  protected get isFormLoading() {
    return this.isLoadingData || this.isLoading;
  }

  protected get submitButtonText() {
    const messageKey = this.isUpdate ? 'action.update' : 'action.add_template';
    return this.$t(messageKey);
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  @Emit('delete')
  protected emitDeleteEvent(payload: ITransferTemplateRecord) {
    return payload;
  }

  protected create(form: ITransferTemplateBody) {
    return TemplatesRequests.createTemplateTransfer(form);
  }

  protected update(form: ITransferTemplateBody) {
    const { amount, description, name } = form;

    return TemplatesRequests.updateTemplateTransfer(this.id, { amount, description, name });
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const handleMethod = this.isUpdate ? this.update : this.create;

    this.isLoading = true;
    const { error } = await handleMethod(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }

  protected deleteButtonClickHandler() {
    if (!this.formData) {
      return;
    }

    this.emitDeleteEvent(this.formData);
  }

  created() {
    if (this.isUpdate) {
      const {
        id,
        name,
        amount,
        description,
        senderCoin: { serial: senderCoin },
        recipientCoin: { serial: recipientCoin },
      } = this.formData;

      this.id = id;

      this.form = {
        name,
        amount,
        description,
        paymentTool: {
          type: 'COIN',
          destValue: recipientCoin,
          srcValue: senderCoin,
        },
      };
    }
  }
}
</script>
