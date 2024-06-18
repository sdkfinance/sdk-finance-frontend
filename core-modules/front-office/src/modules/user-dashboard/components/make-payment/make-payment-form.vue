<template>
  <app-form
    ref="form"
    :loading="isLoading"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="from">
      <app-select
        v-model="form.from"
        full-width
        is-custom
        value-key="serial"
        placeholder="form.label.from_account"
        label="form.label.from_account"
        :options="coinList"
        :option-label="() => ''">
        <template #prefix="{ inputModel }">
          <app-select-custom-option
            :image="inputModel.image"
            :title="inputModel.name"
            :additional="getAmount(inputModel)" />
        </template>
        <template #option="{ scope }">
          <app-select-custom-option
            :image="scope.image"
            :title="scope.name"
            :additional="getAmount(scope)" />
        </template>
      </app-select>
    </app-form-item>
    <app-form-item prop="to">
      <app-select
        v-model="form.to"
        full-width
        is-custom
        value-key="serial"
        placeholder="form.label.choose_account_or_recipient"
        label="form.label.choose_account_or_recipient"
        :options="coinList"
        :option-label="() => ''">
        <template #prefix="{ inputModel }">
          <app-select-custom-option
            :image="inputModel.image"
            :title="inputModel.name"
            :additional="getAmount(inputModel)" />
        </template>
        <template #option="{ scope }">
          <app-select-custom-option
            :image="scope.image"
            :title="scope.name"
            :additional="getAmount(scope)" />
        </template>
      </app-select>
    </app-form-item>
    <app-form-item prop="pay">
      <app-input
        v-model.trim="form.pay"
        label="form.label.you_pay">
        <template #suffix>
          <div class="app-input__additional">1 USD = 0,84 EUR</div>
        </template>
      </app-input>
    </app-form-item>
    <app-form-item prop="pay">
      <app-input
        v-model.trim="form.get"
        label="form.label.recipient_gets" />
    </app-form-item>

    <app-button type="secondary">
      {{ $t('action.transfer_money') }}
    </app-button>
  </app-form>
</template>
AppCustomSelectOption

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import {
  AppButton,
  AppCustomSelectOption,
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
  AppSelectCustomOption,
  AppSelectGroup,
} from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../store/modules';

type IPlainObject = Record<string, any>;

const COMPONENTS = {
  AppSelectGroup,
  AppButton,
  AppFormItem,
  AppForm,
  AppSelectCustomOption,
  AppSelect,
  AppContactItem: AppCustomSelectOption,
  AppInput,
} as const;

@Component({
  name: 'make-payment-form',
  components: COMPONENTS,
})
export default class MakePaymentForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isLoading: boolean = false;

  protected form: IPlainObject = {
    from: '',
    to: '',
    pay: '',
    get: '',
  };

  protected rules: IPlainObject = {};

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins;
  }

  protected created(): void {
    this.userCoinsModule.fetchCoins();
  }

  protected getAmount(data: ICoin): string {
    return data?.currency ? `${data.currency.symbol}${data.availableAmount}` : '';
  }

  protected async handleForm(): Promise<void> {
    // const isValid: boolean = await this.appForm.validate();
    //
    // if (!isValid) {
    //   return;
    // }
    // console.log('Submit');
  }
}
</script>

<style lang="scss">
.app-select-option {
  @apply h-auto #{!important};
}
</style>
