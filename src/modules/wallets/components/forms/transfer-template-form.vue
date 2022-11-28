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
        class="dotted button-as-text"
        @click.prevent="$emit('delete', id)">
        {{ $t('action.delete_template') }}
      </button>
    </app-form-item>
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_template_name"
        label="form.label.template_name"/>
    </app-form-item>
    <app-form-item
      prop="paymentTool.srcValue">
      <app-select
        v-model="form.paymentTool.srcValue"
        :options="coinsList"
        option-label="name"
        option-value="serial"
        placeholder="placeholder.select.choose_wallet"
        full-width
        label="form.label.from_wallet"/>
    </app-form-item>
    <app-form-item prop="paymentTool.destValue">
      <app-input
        v-model="form.paymentTool.destValue"
        placeholder="placeholder.input.input_wallet_serial"
        label="form.label.recipient_wallet"/>
    </app-form-item>
    <app-form-item prop="amount">
      <app-input
        v-model="form.amount"
        placeholder="placeholder.input.input_amount"
        label="form.label.amount"/>
    </app-form-item>
    <app-form-item prop="description">
      <app-input
        v-model="form.description"
        :rows="2"
        type="textarea"
        placeholder="placeholder.input.add_transfer_details"
        label="form.label.description"/>
    </app-form-item>

    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.save_template') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import {
  OnChangeRequiredValidationRule,
  SimpleNumberRangeValidationRule,
  SimpleRequiredValidationRule,
} from '@/rules/validation';
import { ITransferTemplateBody, ITransferTemplateRecord } from '@/services/requests/templates/Templates.types';
import { TemplatesRequests } from '@/services/requests/templates/TemplatesRequests';
import { CatalogModule } from '@/store/modules/dynamic';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class TransferTemplateForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, default: () => ([]) }) readonly coinsList!: string[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: ITransferTemplateRecord;

  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean;

  protected isLoading: boolean = false;

  protected id: string = '';

  protected get paymentProviderList() {
    return CatalogModule.paymentProviderList;
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
  }

  protected get isFormLoading() {
    return this.isLoadingData || this.isLoading;
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
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

    if (!isValid) return;

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
