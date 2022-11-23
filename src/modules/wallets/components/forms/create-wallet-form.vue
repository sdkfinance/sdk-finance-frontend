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
        label="form.label.wallet_name"/>
    </app-form-item>

    <app-form-item
      prop="issuerId">
      <app-select
        v-model="form.issuerId"
        :options="issuerList"
        option-label="currency.name"
        option-value="id"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.currency"/>
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
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { OnChangeRequiredValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { WalletsRequests } from '@/services/requests';
import { IWalletBody } from '@/services/requests/coins/Wallets.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class CreateWalletForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, default: () => ([]) }) readonly issuerList!: string[];

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  protected isLoading: boolean = false;

  protected form: IWalletBody = {
    name: '',
    issuerId: '',
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    issuerId: OnChangeRequiredValidationRule(),
  }

  protected get isFormLoading() {
    return this.isLoadingData || this.isLoading;
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

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
