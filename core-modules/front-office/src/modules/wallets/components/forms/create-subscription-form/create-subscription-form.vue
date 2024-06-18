<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="update"
      prop="delete">
      <button
        type="button"
        class="dotted button-as-text"
        @click.prevent="deleteButtonClickHandler">
        {{ $t('action.delete_subscription') }}
      </button>
    </app-form-item>
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_name"
        label="form.label.subscription_name" />
    </app-form-item>

    <app-form-item prop="templateId">
      <app-select
        v-model="form.templateId"
        :size="APP_SELECT_SIZE.large"
        :options="templatesData"
        option-label="name"
        option-value="id"
        placeholder="placeholder.select.choose_template"
        full-width
        label="form.label.template" />
    </app-form-item>

    <app-form-item prop="recurringStartDate">
      <app-date-picker
        v-model="form.recurringStartDate"
        full-width
        :size="APP_INPUT_SIZE.large"
        input-label="form.label.start_date"
        :prefix-icon="'el-icon-none'"
        placeholder="placeholder.select.select" />
    </app-form-item>

    <app-form-item prop="expirationType">
      <app-select
        v-model="form.expirationType"
        :size="APP_SELECT_SIZE.large"
        :options="expirationTypesList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.expiration_type" />
    </app-form-item>

    <app-form-item
      v-if="isEndDateVisible"
      prop="endDate">
      <app-date-picker
        v-model="form.endDate"
        full-width
        input-label="form.label.end_date"
        :size="APP_INPUT_SIZE.large"
        :prefix-icon="'el-icon-none'"
        placeholder="placeholder.select.select" />
    </app-form-item>

    <app-form-item
      v-if="isAmountVisible"
      prop="amount">
      <app-input
        v-model="form.amount"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_value"
        label="form.label.expiration_amount" />
    </app-form-item>

    <app-form-item
      v-if="isCountVisible"
      prop="count">
      <app-input
        v-model="form.count"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_value"
        label="form.label.count" />
    </app-form-item>

    <app-form-item prop="type">
      <app-select
        v-model="form.type"
        :size="APP_SELECT_SIZE.large"
        :options="subscriptionTypesList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.subscription_type" />
    </app-form-item>
    <app-form-item prop="frequency">
      <app-input
        v-model="form.frequency"
        :size="APP_INPUT_SIZE.large"
        placeholder="placeholder.input.input_value"
        label="form.label.transfer_frequency" />
    </app-form-item>
    <app-form-item
      v-if="update"
      prop="active">
      <app-switch
        v-model="form.active"
        label="form.label.active"
        is-label-after />
    </app-form-item>

    <app-button
      :type="APP_BUTTON_TYPES.primary"
      native-type="submit"
      full-width>
      {{ $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
// @ts-nocheck
import { EXPIRATION_TYPES_ARRAY, SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES_ARRAY } from '@sdk5/shared/constants';
import type { IPlainObject } from '@sdk5/shared/types';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import {
  OnChangeRequiredValidationRule,
  SimpleNumberRangeValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
} from '@sdk5/shared/validation';
import {
  APP_BUTTON_TYPES,
  APP_INPUT_SIZE,
  APP_SELECT_SIZE,
  AppButton,
  AppDatePicker,
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
  AppSwitch,
} from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

import type { ISubscriptionRecord, ISubscriptionsCreateBody, ITransferTemplateRecord } from '../../../../../requests';
import { SubscriptionsRequests, TemplatesRequests } from '../../../../../requests';
import type { TChangeSubscriptionStatusEmitPayload } from './types';

const COMPONENTS = {
  AppForm,
  AppFormItem,
  AppInput,
  AppSelect,
  AppButton,
  AppDatePicker,
  AppSwitch,
} as const;
@Component({
  name: 'create-subscription-form',
  components: COMPONENTS,
})
export default class CreateSubscriptionForm extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Prop({
    type: Boolean,
    default: false,
  })
  readonly update!: boolean;

  @Prop({
    type: Object,
    default: null,
  })
  readonly editFormData!: ISubscriptionRecord | null;

  $props!: {
    update?: boolean;
    editFormData?: ISubscriptionRecord | null;
  };

  protected readonly APP_INPUT_SIZE = APP_INPUT_SIZE;

  protected readonly APP_SELECT_SIZE = APP_SELECT_SIZE;

  protected readonly APP_BUTTON_TYPES = APP_BUTTON_TYPES;

  protected templatesData: ITransferTemplateRecord[] = [];

  protected isLoading: boolean = false;

  protected subscriptionTypesList = SUBSCRIPTION_TYPES_ARRAY;

  protected expirationTypesList = EXPIRATION_TYPES_ARRAY;

  protected form: ISubscriptionsCreateBody & { active?: boolean } = {
    name: '',
    templateId: '',
    expirationType: null,
    endDate: '',
    amount: null,
    count: null,
    recurringStartDate: '',
    type: null,
    frequency: null,
    active: true,
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
  };

  protected get isEndDateVisible() {
    return this.form.expirationType === 'DATE';
  }

  protected get isAmountVisible() {
    return this.form.expirationType === 'AMOUNT';
  }

  protected get isCountVisible() {
    return this.form.expirationType === 'COUNT';
  }

  protected get currentCardStateString() {
    if (!this.update) {
      return null;
    }

    return this.form.active ? SUBSCRIPTION_STATUS.ACTIVE : SUBSCRIPTION_STATUS.STOPPED;
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  @Emit('delete')
  protected emitDeleteEvent(payload: ISubscriptionRecord) {
    return payload;
  }

  @Emit('change-subscription-status')
  protected emitChangeSubscriptionStatusEvent(payload: TChangeSubscriptionStatusEmitPayload) {
    return payload;
  }

  protected async handleForm(): Promise<void> {
    if (
      this.update &&
      this.editFormData &&
      this.currentCardStateString !== null &&
      this.currentCardStateString !== this.editFormData.subscriptionStatus
    ) {
      this.emitChangeSubscriptionStatusEvent({
        status: this.currentCardStateString,
        subscriptionId: this.editFormData.id,
      });
      return;
    }

    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const { active, ...createSubscriptionPayload } = this.form;

    this.isLoading = true;
    const { error } = await SubscriptionsRequests.createSubscription(createSubscriptionPayload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
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

  protected deleteButtonClickHandler() {
    if (!this.editFormData) {
      return;
    }

    this.emitDeleteEvent(this.editFormData);
  }

  @Watch('editFormData', { immediate: true })
  protected editFormDataChangeHandler(formData?: ISubscriptionRecord | null) {
    if (!formData || !this.update) {
      return;
    }

    const {
      name,
      templateDto: { id: templateId, amount },
      expirationConfig: { expirationDate, type: expirationType, count },
      frequency,
      recurringStartDate,
      subscriptionStatus,
      type,
    } = formData;

    this.form = {
      name,
      templateId,
      frequency,
      type,
      endDate: expirationType === 'DATE' && expirationDate ? new Date(expirationDate).toISOString() : '',
      expirationType,
      recurringStartDate: new Date(recurringStartDate).toISOString(),
      amount,
      count,
      active: subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE,
    };
  }

  created() {
    this.fetchTemplates();
  }
}
</script>
