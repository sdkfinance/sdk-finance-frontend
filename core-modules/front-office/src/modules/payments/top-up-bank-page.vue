<template>
  <app-step-controller
    class="top-up-bank"
    :total-steps="1"
    back-name="user-top-up-operations"
    is-close-visible>
    <template #default="{ goToBackPage }">
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          {{ $t('pages.user_dashboard.payments.top_up_via_bank') }}
        </template>
        <div class="top-up-bank__subtitle">
          {{ $t('pages.user_dashboard.payments.select_the_account_you_want_to_top_up') }}
        </div>
        <app-form
          ref="form"
          :rules="rules"
          :loading="isLoading"
          :model="form"
          @submit.native.prevent="handleForm(goToBackPage)">
          <app-form-item prop="account">
            <account-select
              v-model="form.account"
              label="form.label.account" />
          </app-form-item>
          <app-form-item prop="account">
            <app-input
              v-model="form.amount"
              placeholder="form.label.amount"
              label="form.label.amount" />
          </app-form-item>
          <app-button
            native-type="submit"
            full-width>
            {{ $t('action.create_top_up_request') }}
          </app-button>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import type { ICoin, ITopUpViaBankRequestPayload } from '@sdk5/shared/requests';
import { TopUpRequests } from '@sdk5/shared/requests';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleNumberRangeValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppStepController } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';

import AccountDetailsBlock from '../user-dashboard/components/account-details-block.vue';
import AccountSelect from '../user-dashboard/components/account-select.vue';

const COMPONENTS = {
  AppButton,
  AppInput,
  AppFormItem,
  AppForm,
  AccountDetailsBlock,
  AccountSelect,
  AppStepController,
  AppFormWrapper,
} as const;

@Component({
  name: 'top-up-bank-page',
  components: COMPONENTS,
})
export default class TopUpBankPage extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  protected isLoading: boolean = false;

  protected form: { account: ICoin; amount: number } = {
    account: {} as ICoin,
    amount: NaN,
  };

  protected rules: IPlainObject = {
    account: OnChangeRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
  };

  protected async handleForm(goToBackPage: Function): Promise<void> {
    const isValid: boolean = await this.appForm?.validate();

    if (!isValid) {
      return;
    }

    const payload: ITopUpViaBankRequestPayload = {
      coinSerial: this.form.account.serial,
      amount: Number(this.form.amount),
    };

    this.isLoading = true;
    const { error } = await TopUpRequests.createTopUpRequestViaBank(payload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    goToBackPage();
  }
}
</script>

<style lang="scss">
.top-up-bank {
  &__subtitle {
    @apply text-gray-500 text-xl mb-32 font-medium;
  }

  &__info {
    @apply mb-16 mt-24 text-gray-500;
  }
}

@media print {
  .app-form-wrapper__title,
  .top-up-bank__subtitle,
  .app-select,
  .top-up-bank__info,
  .app-step-controller__close,
  .app-step-controller__back {
    display: none !important;
  }
}
</style>
