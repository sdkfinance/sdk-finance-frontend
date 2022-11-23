<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_name"
        label="form.label.subscription_name"/>
    </app-form-item>

    <app-form-item
      prop="templateId">
      <app-select
        v-model="form.templateId"
        :options="templatesData"
        option-label="name"
        option-value="id"
        placeholder="placeholder.select.choose_template"
        full-width
        label="form.label.template"/>
    </app-form-item>

    <app-form-item prop="recurringStartDate">
      <app-input label="form.label.start_date">
        <app-date-picker
          v-model="form.recurringStartDate"
          full-width
          :prefix-icon="'el-icon-none'"
          placeholder="placeholder.select.select"/>
      </app-input>
    </app-form-item>

    <app-form-item
      prop="expirationType">
      <app-select
        v-model="form.expirationType"
        :options="expirationTypesList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.expiration_type"/>
    </app-form-item>

    <app-form-item
      v-if="isEndDateVisible"
      prop="endDate">
      <app-input label="form.label.end_date">
        <app-date-picker
          v-model="form.endDate"
          full-width
          :prefix-icon="'el-icon-none'"
          placeholder="placeholder.select.select"/>
      </app-input>
    </app-form-item>

    <app-form-item
      v-if="isAmountVisible"
      prop="amount">
      <app-input
        v-model="form.amount"
        placeholder="placeholder.input.input_value"
        label="form.label.expiration_amount"/>
    </app-form-item>

    <app-form-item
      v-if="isCountVisible"
      prop="count">
      <app-input
        v-model="form.count"
        placeholder="placeholder.input.input_value"
        label="form.label.count"/>
    </app-form-item>

    <app-form-item
      prop="type">
      <app-select
        v-model="form.type"
        :options="subscriptionTypesList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.subscription_type"/>
    </app-form-item>
    <app-form-item prop="frequency">
      <app-input
        v-model="form.frequency"
        placeholder="placeholder.input.input_value"
        label="form.label.transfer_frequency"/>
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

import AppButton from '@/components/ui-framework/app-button.vue';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { EXPIRATION_TYPES_ARRAY, SUBSCRIPTION_TYPES_ARRAY } from '@/constants';
import {
  OnChangeRequiredValidationRule,
  SimpleNumberRangeValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
} from '@/rules/validation';
import { SubscriptionsRequests } from '@/services/requests';
import { ISubscriptionsCreateBody } from '@/services/requests/subscriptions/Subscriptions.types';
import { ITransferTemplateRecord } from '@/services/requests/templates/Templates.types';
import { TemplatesRequests } from '@/services/requests/templates/TemplatesRequests';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
    AppDatePicker,
  },
})
export default class CreateSubscriptionForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected templatesData: ITransferTemplateRecord[] = [];

  protected isLoading: boolean = false;

  protected subscriptionTypesList = SUBSCRIPTION_TYPES_ARRAY;

  protected expirationTypesList = EXPIRATION_TYPES_ARRAY;

  protected form: ISubscriptionsCreateBody = {
    name: '',
    templateId: '',
    expirationType: null,
    endDate: '',
    amount: null,
    count: null,
    recurringStartDate: '',
    type: null,
    frequency: null,
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    templateId: OnChangeRequiredValidationRule(),
    expirationType: OnChangeRequiredValidationRule(),
    endDate: OnChangeRequiredValidationRule(),
    amount: SimpleNumberRangeValidationRule(),
    count: SimpleNumberValidationRule(),
    recurringStartDate: OnChangeRequiredValidationRule(),
    type: OnChangeRequiredValidationRule(),
    frequency: SimpleNumberValidationRule(),
  }

  protected get isEndDateVisible() {
    return this.form.expirationType === 'DATE';
  }

  protected get isAmountVisible() {
    return this.form.expirationType === 'AMOUNT';
  }

  protected get isCountVisible() {
    return this.form.expirationType === 'COUNT';
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await SubscriptionsRequests.createSubscription(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.onSubmit();
  }

  protected async fetchTemplates(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await TemplatesRequests.getTemplateTransfers();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }
    this.templatesData = response?.transferTemplates || [];
  }

  created() {
    this.fetchTemplates();
  }

}
</script>
