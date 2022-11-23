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
          placeholder="form.label.template_name"/>
      </app-form-item>
      <app-simple-details-card
        :details="paymentDetails"
        class="mb-36"/>
      <app-button native-type="submit">
        {{ $t('action.save_as_template') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import {
  Component, Emit,
  Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSimpleDetailsCard from '@/components/ui-kit/app-simple-details-card.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { TemplatesRequests } from '@/services/requests/templates/TemplatesRequests';
import { ITransferCalculateResponse } from '@/services/requests/transfers/Transfers.types';
import { IDetailsValue, IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
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
  }

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  }

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
