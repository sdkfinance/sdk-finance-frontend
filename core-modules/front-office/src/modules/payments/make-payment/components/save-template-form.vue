<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_dashboard.payments.save_template_title') }}
    </template>
    <app-form
      ref="form"
      :model="form"
      :rules="rules"
      :loading="isLoading"
      @submit.native.prevent="handleForm">
      <app-form-item prop="name">
        <app-input
          v-model="form.name"
          label="form.label.template_name"
          placeholder="form.label.template_name" />
      </app-form-item>
      <app-simple-details-card
        :details="paymentDetails"
        class="mb-36" />
      <app-button
        native-type="submit"
        full-width>
        {{ $t('action.save_as_template') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import type { ITransferCalculateResponse } from '@sdk5/shared/requests';
import type { IDetailsValue, IPlainObject } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppSimpleDetailsCard } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

import { TemplatesRequests } from '../../../../requests';

@Component({
  name: 'save-template-form',
  components: {
    AppSimpleDetailsCard,
    AppButton,
    AppInput,
    AppFormItem,
    AppForm,
    AppFormWrapper,
  },
})
export default class SaveTemplateForm extends Vue {
  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: String, required: true }) readonly operationId!: string;

  @Prop({ type: Object, required: true }) readonly paymentData!: ITransferCalculateResponse;

  @Prop({ type: Boolean, default: false }) readonly isAccountPage!: boolean;

  protected form: { name: string } = {
    name: '',
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  };

  protected isLoading: boolean = false;

  protected get paymentDetails(): IDetailsValue[] {
    return [
      {
        label: this.isAccountPage ? 'form.label.from_account' : 'form.label.from_card',
        param: 'srcValue',
        value: this.paymentData?.paymentToolDetails?.srcValue,
      },
      {
        label: 'form.label.recipient_full_name',
        param: 'recipientFullName',
        value: this.paymentData?.paymentToolDetails?.recipientFullName,
        hide: !this.paymentData?.paymentToolDetails?.recipientFullName,
      },
      {
        label: this.isAccountPage ? 'form.label.to_account' : 'form.label.to_card',
        param: 'srcValue',
        value: this.paymentData?.paymentToolDetails?.destValue,
      },
    ];
  }

  @Emit('submitted')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const { name } = this.form;
    const { transactionAmount: amount } = this.paymentData;

    this.isLoading = true;
    const { error } = await TemplatesRequests.createTemplateTransferByOperationId(this.operationId, {
      name,
      amount,
      description: '',
      reusable: true,
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }
}
</script>
