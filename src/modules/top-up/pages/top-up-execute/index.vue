<template>
  <div>
    <template v-if="executeStep === 'validate'">
      <app-form
        ref="formValidate"
        :loading="isLoading"
        class="form"
        :model="formValidate"
        :rules="rulesFormValidate">
        <app-form-item prop="contact">
          <app-input
            v-model="formValidate.contact"
            label="form.label.user_contact"
            placeholder="placeholder.input.input_users_contact"
            clearable/>
        </app-form-item>

        <app-button
          class="btn-submit"
          type="primary"
          @click.native.prevent="handleValidate">
          {{ $t('action.next') }}
        </app-button>
      </app-form>
    </template>

    <template v-if="executeStep === 'calculate'">
      <app-form
        ref="formCalculate"
        :loading="isLoading"
        class="form"
        :model="formCalculate"
        :rules="rulesFormCalculate">
        <app-form-item prop="coin">
          <app-select
            v-model="formCalculate.coinSerial"
            :options="coinList"
            option-label="name"
            option-value="serial"
            placeholder="placeholder.select.choose_wallet"
            full-width
            label="form.label.wallet"/>
        </app-form-item>

        <app-form-item prop="amount">
          <app-input
            v-model="formCalculate.amount"
            placeholder="placeholder.input.input_amount"
            label="form.label.amount"/>
        </app-form-item>

        <div class="buttons-container">
          <app-button
            class="btn-submit"
            type="primary"
            @click.native.prevent="executeStep = 'validate'">
            {{ $t('action.back') }}
          </app-button>

          <app-button
            class="btn-submit"
            type="primary"
            @click.native.prevent="handleCalculate">
            {{ $t('action.next') }}
          </app-button>
        </div>

        <div v-if="hasCommission">
          <div class="form__list">
            <p>
              <strong>{{ $t('pages.top_up.commission_amount') }}: </strong>
              {{ commissions.amount }} {{ commissions.currency }}
            </p>
            <p>
              <strong>{{ $t('pages.top_up.view_amount_commission') }}: </strong>
              {{ commissions.view_amount }} {{ commissions.currency }}
            </p>
          </div>
        </div>
      </app-form>
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Ref,
  Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import {
  EmailOrPhoneValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
} from '@/rules/validation';
import { OrganizationsRequests, TopUpRequests, UsersRequests } from '@/services/requests';
import { ITopUpCalculatePayload } from '@/services/requests/bank-top-ups/TopUp.types';
import { ICoin } from '@/services/requests/organizations/Coin.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

type TExecuteStep = 'validate' | 'calculate' | 'process';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppSelect,
    AppInput,
    AppButton,
  },
})
export default class TopUpExecute extends Vue {

  @Ref('formValidate') readonly appFormValidate!: AppForm;

  @Ref('formCalculate') readonly appFormCalculate!: AppForm;

  protected isLoading: boolean = false;

  protected executeStep: TExecuteStep = 'validate';

  protected rulesFormValidate: IPlainObject = {
    contact: EmailOrPhoneValidationRule(true),
  };

  protected formValidate: { contact: null | string } = {
    contact: null,
  };

  protected rulesFormCalculate: IPlainObject = {
    coinSerial: SimpleRequiredValidationRule(),
    amount: SimpleNumberValidationRule(),
  };

  protected formCalculate: ITopUpCalculatePayload = {
    coinSerial: null,
    amount: null,
  };

  protected coinList: ICoin[] = [];

  protected commissions: IPlainObject = {
    amount: null,
    view_amount: null,
    currency: null,
  }

  protected get hasCommission(): boolean {
    return Object.values(this.commissions).every((i) => i);
  }

  protected async handleValidate(): Promise<void> {
    const isValid = await this.appFormValidate.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await UsersRequests.validateContact(String(this.formValidate.contact));
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    await this.setCalculateStep(String(response?.user?.profileOrganizationId));
  }

  protected async setCalculateStep(profileOrganizationId: string): Promise<void> {
    this.isLoading = true;
    const { response, error } = await OrganizationsRequests.getWallets(profileOrganizationId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.executeStep = 'calculate';
    this.coinList = response?.coins || [];
  }

  protected async handleCalculate(): Promise<void> {
    const isValid = await this.appFormCalculate.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await TopUpRequests.calculateTopUpCommission({
      ...this.formCalculate,
      amount: Number(this.formCalculate.amount),
    });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();

    this.commissions.amount = response?.commissionAmountPush.toFixed(2);
    this.commissions.view_amount = response?.recipientAmountPush.toFixed(2);
    this.commissions.currency = response?.issuer.currency;
  }

}
</script>
