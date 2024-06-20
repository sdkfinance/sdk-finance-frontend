<template>
  <app-step-controller
    :total-steps="1"
    back-name="user-make-payment-operations"
    is-close-visible>
    <template #default>
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          {{ $t('pages.user_dashboard.payments.bank_transfer_title') }}
        </template>
        <app-form
          ref="form"
          key="form"
          :loading="isLoading"
          :model="form"
          :rules="rules"
          @submit.native.prevent="handleForm">
          <app-form-item prop="name">
            <app-input
              v-model.trim="form.name"
              name="name"
              size="large"
              autocomplete="off"
              label="form.label.company_or_iban"
              placeholder="form.label.company_or_iban" />
          </app-form-item>
          <app-button
            class="submit-button"
            native-type="submit"
            full-width>
            {{ $t('action.next') }}
          </app-button>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import type { IPlainObject } from '@sdk5/shared/types';
import { successNotification } from '@sdk5/shared/utils';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppStepController } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';

@Component({
  name: 'bank-transfer',
  components: {
    AppButton,
    AppStepController,
    AppForm,
    AppInput,
    AppFormItem,
    AppFormWrapper,
  },
})
export default class BankTransfer extends Vue {
  @Ref('form') readonly appForm!: AppForm;

  protected isLoading: boolean = false;

  protected form: IPlainObject = {
    name: '',
  };

  protected rules: IPlainObject = {};

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (isValid) {
      successNotification();
      await this.$router.push({ name: 'user-make-payment-operations' });
    }
  }
}
</script>
