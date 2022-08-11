<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_currency_name"
        :label="$t('form.label.name')"/>
    </app-form-item>
    <app-form-item
      prop="code">
      <app-input
        v-model.trim="form.code"
        placeholder="placeholder.input.input_currency_code"
        :label="$t('form.label.code')"/>
    </app-form-item>
    <app-form-item
      prop="digitalCode">
      <app-input
        v-model.trim="form.digitalCode"
        placeholder="placeholder.input.input_digital_code_currency"
        :label="$t('form.label.digital_code')"/>
    </app-form-item>
    <app-form-item
      prop="symbol">
      <app-input
        v-model="form.symbol"
        placeholder="placeholder.input.input_description"
        :label="$t('form.label.symbol')"/>
    </app-form-item>
    <app-form-item
      prop="description">
      <app-input
        v-model="form.description"
        placeholder="placeholder.input.input_description"
        :label="$t('form.label.description')"/>
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
  Component, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { CurrencyRequests } from '@/services/requests';
import { successNotification, errorNotification } from '@/utils';
import { ICurrency } from '@/services/requests/currencies/Currency.types';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class CreateCurrencyForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  public form: ICurrency = {
    code: '',
    digitalCode: '',
    symbol: '',
    name: '',
    description: '',
  };

  public rules = {
    code: SimpleRequiredValidationRule(),
    digitalCode: SimpleRequiredValidationRule(),
    symbol: SimpleRequiredValidationRule(),
    name: SimpleRequiredValidationRule(),
    description: SimpleRequiredValidationRule(),
  };

  public isLoading: boolean = false;

  @Emit('created')
  onCreated(): boolean {
    return true;
  }

  public async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await CurrencyRequests.create(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    } else {
      successNotification();
      this.onCreated();
    }
  }

}
</script>
