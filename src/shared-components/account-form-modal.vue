<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.accounts.add_account') }}
    </template>
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item
        prop="name">
        <app-input
          v-model="form.name"
          label="form.label.account_name"
          placeholder="placeholder.input.input_account_name"/>
      </app-form-item>

      <app-form-item
        prop="issuerId">
        <app-select
          v-model="form.issuerId"
          clearable
          class="el-form-item"
          label="form.label.currency"
          full-width
          placeholder="placeholder.select.choose_currency"
          value-key="currency.name"
          :options="issuerList"
          option-label="currency.name"
          option-value="id"/>
      </app-form-item>

      <app-button
        native-type="submit">
        {{ $t('action.add_account') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import {
  Component, Emit, Ref,
  Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { WalletsRequests } from '@/services/requests';
import { IWalletBody } from '@/services/requests/coins/Wallets.types';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { CatalogModule } from '@/store/modules/dynamic';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppFormWrapper,
    AppForm,
    AppInput,
    AppFormItem,
    AppSelect,
    AppButton,
  },
})
export default class AccountFormModal extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Emit('submit')
  protected submit(payload: IWalletBody): IWalletBody {
    return payload;
  }

  protected isLoading: boolean = false;

  protected form: IWalletBody = {
    name: '',
    issuerId: '',
  }

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    issuerId: SimpleRequiredValidationRule(),
  };

  protected currencyList: ICurrency[] = [];

  protected get issuerList(): IIssuer[] {
    return CatalogModule.issuerList;
  }

  protected created(): void {
    CatalogModule.fetchIssuers();
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    const { error } = await WalletsRequests.createWallet(this.form);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.submit(this.form);
  }

}
</script>
