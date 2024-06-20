<template>
  <app-form
    ref="appFormRef"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="isUpdateForm"
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
        size="large"
        placeholder="placeholder.input.input_name"
        label="form.label.subscription_name" />
    </app-form-item>

    <app-form-item prop="templateId">
      <app-select
        v-model="form.templateId"
        size="large"
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
        size="large"
        input-label="form.label.start_date"
        :prefix-icon="'el-icon-none'"
        placeholder="placeholder.select.select" />
    </app-form-item>

    <app-form-item prop="expirationType">
      <app-select
        v-model="form.expirationType"
        size="large"
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
        size="large"
        :prefix-icon="'el-icon-none'"
        placeholder="placeholder.select.select" />
    </app-form-item>

    <app-form-item
      v-if="isAmountVisible"
      prop="amount">
      <app-input
        v-model="form.amount"
        size="large"
        placeholder="placeholder.input.input_value"
        label="form.label.expiration_amount" />
    </app-form-item>

    <app-form-item
      v-if="isCountVisible"
      prop="count">
      <app-input
        v-model="form.count"
        size="large"
        placeholder="placeholder.input.input_value"
        label="form.label.count" />
    </app-form-item>

    <app-form-item prop="type">
      <app-select
        v-model="form.type"
        size="large"
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
        size="large"
        placeholder="placeholder.input.input_value"
        label="form.label.transfer_frequency" />
    </app-form-item>
    <app-form-item
      v-if="isUpdateForm"
      prop="active">
      <app-switch
        v-model="form.active"
        label="form.label.active"
        is-label-after />
    </app-form-item>

    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t(submitButtonText) }}
    </app-button>
  </app-form>
</template>

<script setup lang="ts">
import { EXPIRATION_TYPES_ARRAY, SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPES_ARRAY } from '@sdk5/shared/constants';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import {
  OnChangeRequiredValidationRule,
  SimpleNumberRangeValidationRule,
  SimpleNumberValidationRule,
  SimpleRequiredValidationRule,
} from '@sdk5/shared/validation';
import { AppButton, AppDatePicker, AppForm, AppFormItem, AppInput, AppSelect, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { computed, onMounted, ref, watch } from 'vue';

import type { ISubscriptionRecord, ISubscriptionsCreateBody, ITransferTemplateRecord } from '../../../../../requests';
import { SubscriptionsRequests, TemplatesRequests } from '../../../../../requests';
import type { TChangeSubscriptionStatusEmitPayload } from './types';

const props = withDefaults(
  defineProps<{
    editFormData?: ISubscriptionRecord | null;
  }>(),
  {
    editFormData: undefined,
  },
);
const emit = defineEmits<{
  (event: 'submit'): void;
  (event: 'delete', payload: ISubscriptionRecord): void;
  (event: 'change-subscription-status', payload: TChangeSubscriptionStatusEmitPayload): void;
}>();

const subscriptionTypesList = SUBSCRIPTION_TYPES_ARRAY;
const expirationTypesList = EXPIRATION_TYPES_ARRAY;

const rules = {
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

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;

const form = ref<Partial<ISubscriptionsCreateBody> & { active?: boolean }>({
  name: undefined,
  templateId: undefined,
  expirationType: undefined,
  endDate: undefined,
  amount: undefined,
  count: undefined,
  recurringStartDate: undefined,
  type: undefined,
  frequency: undefined,
  active: true,
});
const isLoading = ref(false);
const templatesData = ref([] as ITransferTemplateRecord[]);

const isEndDateVisible = computed(() => form.value.expirationType === 'DATE');
const isAmountVisible = computed(() => form.value.expirationType === 'AMOUNT');
const isCountVisible = computed(() => form.value.expirationType === 'COUNT');
const isUpdateForm = computed(() => !!props.editFormData);
const submitButtonText = computed(() => (isUpdateForm.value ? 'action.update' : 'action.create'));
const currentCardStateString = computed(() => {
  if (!isUpdateForm.value) {
    return null;
  }

  return form.value.active ? SUBSCRIPTION_STATUS.ACTIVE : SUBSCRIPTION_STATUS.STOPPED;
});

const onSubmit = () => {
  emit('submit');
};
const emitDeleteEvent = (payload: ISubscriptionRecord) => {
  emit('delete', payload);
};
const emitChangeSubscriptionStatusEvent = (payload: TChangeSubscriptionStatusEmitPayload) => {
  emit('change-subscription-status', payload);
};
const deleteButtonClickHandler = () => {
  if (!props.editFormData) {
    return;
  }

  emitDeleteEvent(props.editFormData);
};
const fetchTemplates = async () => {
  isLoading.value = true;
  const { response, error } = await TemplatesRequests.getTemplateTransfers();
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  templatesData.value = response?.transferTemplates || [];
};
const handleForm = async () => {
  if (isUpdateForm.value && props.editFormData && currentCardStateString.value !== null) {
    emitChangeSubscriptionStatusEvent({
      status: currentCardStateString.value,
      subscriptionId: props.editFormData.id,
    });
    return;
  }

  const isValid = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  const { active, ...createSubscriptionPayload } = form.value;

  isLoading.value = true;
  const { error } = await SubscriptionsRequests.createSubscription(createSubscriptionPayload as ISubscriptionsCreateBody);
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  successNotification();
  onSubmit();
};
const editFormDataChangeHandler = (formData?: ISubscriptionRecord | null) => {
  if (!formData || !isUpdateForm.value) {
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

  form.value = {
    name,
    templateId,
    frequency,
    type,
    endDate: expirationType === 'DATE' && expirationDate ? new Date(expirationDate).toISOString() : undefined,
    expirationType,
    recurringStartDate: new Date(recurringStartDate).toISOString(),
    amount,
    count,
    active: subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE,
  };
};

watch(() => props.editFormData, editFormDataChangeHandler, { immediate: true });

onMounted(() => {
  fetchTemplates();
});
</script>
