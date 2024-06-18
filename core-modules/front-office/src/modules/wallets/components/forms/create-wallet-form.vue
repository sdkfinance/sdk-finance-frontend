<template>
  <app-form
    ref="form"
    :loading="isFormLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_name"
        label="form.label.wallet_name" />
    </app-form-item>

    <app-form-item prop="issuerId">
      <app-select
        v-model="form.currencyId"
        :options="issuerList"
        option-label="currency.name"
        option-value="id"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.currency" />
    </app-form-item>

    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import type { IWalletBody } from '@sdk5/shared/requests';
import { WalletsRequests } from '@sdk5/shared/requests';
import { errorNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput, AppSelect } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

// Not used
@Component({
  name: 'create-wallet-form',
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class CreateWalletForm extends Vue {
  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Array, default: () => [] }) readonly issuerList!: string[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  protected isLoading: boolean = false;

  protected form: IWalletBody = {
    name: '',
    currencyId: '',
    type: 'client',
  };

  protected rules: Record<keyof typeof this.form, unknown> = {
    name: SimpleRequiredValidationRule(),
    currencyId: OnChangeRequiredValidationRule(),
    type: null,
  };

  protected get isFormLoading() {
    return this.isLoadingData || this.isLoading;
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { error } = await WalletsRequests.createWallet(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    }

    this.onSubmit();
  }
}
</script>
