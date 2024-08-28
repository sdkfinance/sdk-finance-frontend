<template>
  <app-step-controller
    :total-steps="2"
    back-name="user-make-payment-operations"
    is-close-visible>
    <template #default="{ currentStep, nextStep }">
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          <template v-if="isAccountPage">
            {{ $t('pages.user_dashboard.payments.transfer_account_title') }}
          </template>
          <template v-else>
            {{ $t('pages.user_dashboard.payments.transfer_card_title') }}
          </template>
        </template>
        <transition-group name="page">
          <app-form
            v-show="currentStep === 1"
            ref="appFormRef"
            key="form"
            :loading="isLoading"
            :model="form"
            :rules="rules"
            @submit.native.prevent="handleForm(nextStep)">
            <app-form-item prop="from">
              <account-select
                v-if="isAccountPage"
                v-model="form.from"
                option-value="serial"
                label="form.label.from_account"
                @input="resetTemplate" />
              <card-select
                v-else
                v-model="form.from"
                label="form.label.from_in_system_card"
                @input="resetTemplate" />
            </app-form-item>

            <app-form-item prop="to">
              <app-custom-select
                v-if="isAccountPage"
                v-model="form.to"
                label="form.label.to_account"
                placeholder="placeholder.input.input_account_number_or_choose_recipient"
                input-placeholder="placeholder.input.input_recipient_account_number"
                :on-load="getTemplateFilteredTransfers"
                @manual-input="resetTemplate">
                <template #options="{ setValueManual, removeItem, records }">
                  <app-custom-select-option
                    v-for="template in records"
                    :key="template.id"
                    :color="template.color"
                    :title="template.name"
                    :subtitle="`${template.paymentToolDetails.currency} ${template.paymentToolDetails.destValue}`"
                    @action-click="deleteTemplate(template.id, removeItem)"
                    @click="selectTemplate(template, setValueManual)" />
                </template>
              </app-custom-select>
              <app-custom-select
                v-else
                v-model="form.to"
                label="form.label.to_in_system_card"
                placeholder="placeholder.input.input_card_number_or_choose_recipient"
                :on-load="getTemplateFilteredTransfers">
                <template #input>
                  <app-input-card-number
                    v-model="form.to"
                    is-masked-card-available
                    placeholder="placeholder.input.input_card_number"
                    :label="''"
                    @input="resetTemplate" />
                </template>
                <template #options="{ setValueManual, removeItem, records }">
                  <app-custom-select-option
                    v-for="template in records"
                    :key="template.id"
                    :color="template.color"
                    :title="template.name"
                    :subtitle="`${template.paymentToolDetails.currency} ${template.paymentToolDetails.destValue}`"
                    @action-click="deleteTemplate(template.id, removeItem)"
                    @click="selectTemplate(template, setValueManual)" />
                </template>
              </app-custom-select>
            </app-form-item>

            <app-form-item prop="amount">
              <app-input
                v-model="form.amount"
                size="large"
                name="amount"
                autocomplete="off"
                label="form.label.transfer_amount"
                placeholder="placeholder.input.input_amount" />
            </app-form-item>

            <operation-commission
              class="mb-36"
              :rows="2">
              <template #label-1>
                {{ $t('form.label.recipient_gets') }}
              </template>
              <template #value-1>
                {{ isCommissionCalculated ? '' : emptyChar }}
                {{ getProp(commission, 'recipientAmountPush') }} {{ getProp(commission, 'currency.code') }}
              </template>
              <template #label-2>
                {{ $t('form.label.fee') }}
              </template>
              <template #value-2>
                {{ isCommissionCalculated ? '' : emptyChar }}
                {{ getProp(commission, 'commissionAmountPush') }} {{ getProp(commission, 'currency.code') }}
              </template>
            </operation-commission>

            <app-button
              class="submit-button"
              native-type="submit"
              full-width>
              {{ $t('action.next') }}
            </app-button>
          </app-form>
          <div
            v-show="currentStep === 2"
            key="details">
            <transfer-details
              :data="commission"
              :is-account-page="isAccountPage" />
            <app-button
              class="submit-button"
              native-type="button"
              full-width
              @click="onMakePayment">
              {{ $t('action.make_payment') }}
            </app-button>
          </div>
        </transition-group>
      </app-form-wrapper>
      <app-modal
        ref="successModal"
        is-centred
        is-full-width>
        <template #default="{ onSubmit, onClose }">
          <app-info-modal
            title="pages.user_dashboard.payments.payment_success_title"
            subtitle="pages.user_dashboard.payments.payment_success_info"
            confirm-text="action.save_as_template"
            cancel-text="action.done"
            :is-cancel-visible="true"
            :type="infoModalTypes.success"
            is-buttons-in-row
            @cancel="onClose"
            @confirm="onSubmit" />
        </template>
      </app-modal>
      <app-modal
        ref="saveTemplateModal"
        modal-body-class="max-w-520"
        is-full-width>
        <template #default="{ onSubmit }">
          <save-template-form
            :operation-id="operationId"
            :payment-data="commission"
            :is-account-page="isAccountPage"
            @submitted="onSubmit" />
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script setup lang="ts">
import config from '@sdk5/shared/config';
import type { ITransferBody, ITransferCalculateResponse, TPaymentToolDetailsType, TTransferResponse } from '@sdk5/shared/requests';
import { TransfersRequests } from '@sdk5/shared/requests';
import { errorNotification, getProp, successNotification } from '@sdk5/shared/utils';
import { OnChangeRequiredValidationRule, SimpleNumberValidationRule } from '@sdk5/shared/validation';
import {
  AppButton,
  AppCustomSelect,
  AppCustomSelectOption,
  AppForm,
  AppFormItem,
  AppFormWrapper,
  AppInfoModal,
  AppInput,
  AppInputCardNumber,
  AppModal,
  AppStepController,
  InfoModalTypes,
} from '@sdk5/ui-kit-front-office';
import { useDebounceFn } from '@vueuse/core';
import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router/composables';

import type { ITransferTemplateExecute, ITransferTemplateRecord } from '../../../requests';
import { TemplatesRequests } from '../../../requests';
import AccountSelect from '../../user-dashboard/components/account-select.vue';
import CardSelect from '../../user-dashboard/components/card-select.vue';
import OperationCommission from '../../user-dashboard/components/operation-commission.vue';
import SaveTemplateForm from './components/save-template-form.vue';
import TransferDetails from './components/transfer-details.vue';

const props = withDefaults(
  defineProps<{
    isAccountPage?: boolean;
  }>(),
  {
    isAccountPage: false,
  },
);

const router = useRouter();

const { emptyChar } = config;
const infoModalTypes = InfoModalTypes;

const rules = {
  from: OnChangeRequiredValidationRule(),
  to: OnChangeRequiredValidationRule(),
  amount: SimpleNumberValidationRule(),
  template: null,
};

const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
const successModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;
const saveTemplateModal = ref(null) as unknown as Ref<InstanceType<typeof AppModal>>;

const form = ref({
  from: '',
  to: '',
  amount: undefined as number | undefined,
  template: {} as ITransferTemplateRecord,
});
const commission = ref({} as ITransferCalculateResponse);
const operationId = ref('');
const isLoading = ref(false);

const paymentToolType = computed<TPaymentToolDetailsType>(() => (props.isAccountPage ? 'COIN' : 'SMART_CARD'));
const isCommissionCalculated = computed(() => commission.value && Object.keys(commission.value).length > 0);

const getPayload = (): ITransferBody => {
  const { from, to, amount } = form.value;

  return {
    paymentTool: {
      type: paymentToolType.value,
      srcValue: from,
      destValue: to,
    },
    amount: Number(amount),
    description: '',
  };
};
const resetTemplate = () => {
  if (form.value.template?.id) {
    form.value.template = {} as ITransferTemplateRecord;
    form.value.to = '';
  }
};
const calculateCommissionFee = (): ReturnType<typeof TransfersRequests.calculateCommissionFee> => {
  if (form.value.template?.id) {
    const {
      amount,
      template: { id },
    } = form.value;
    return TemplatesRequests.calculateCommissionFee(id, Number(amount));
  }

  const payload = getPayload();
  return TransfersRequests.calculateCommissionFee(payload);
};
const onCalculateCommission = async () => {
  if (!form.value.amount) {
    return;
  }

  const isValid: boolean = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  isLoading.value = true;
  const { response, error } = await calculateCommissionFee();
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  commission.value = response || ({} as ITransferCalculateResponse);
};
const handleForm = async (onNextStep: () => void) => {
  const isValid: boolean = await appFormRef.value.validate();

  if (!isValid) {
    return;
  }

  if (isCommissionCalculated.value) {
    onNextStep();
    return;
  }

  onCalculateCommission();
};
const executeTransfer = (): ReturnType<typeof TransfersRequests.executeTransfer | typeof TemplatesRequests.executeTransfer> => {
  if (form.value.template?.id) {
    const {
      amount,
      template: { id },
    } = form.value;
    return TemplatesRequests.executeTransfer(id, Number(amount));
  }

  const payload = getPayload();
  return TransfersRequests.executeTransfer(payload);
};
const setOperationId = (response: TTransferResponse | ITransferTemplateExecute) => {
  const isTransferResponse = (value: unknown): value is TTransferResponse => !!(value as TTransferResponse).process;
  operationId.value = isTransferResponse(response) ? response.process?.id : response?.businessProcessId;
};
const onMakePayment = async () => {
  isLoading.value = true;
  const { response, error } = await executeTransfer();
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  setOperationId(response);

  const isCreateTemplate = await successModal.value.open();

  if (isCreateTemplate) {
    await saveTemplateModal.value.open();
  }

  router.push({ name: 'user-make-payment-operations' });
};
const selectTemplate = (template: ITransferTemplateRecord, setValueManual: (value: string) => void) => {
  const {
    paymentToolDetails: { srcId, srcValue, destValue },
    amount,
  } = template;
  form.value.from = props.isAccountPage ? srcValue : srcId;
  form.value.amount = amount;
  form.value.template = template;
  setValueManual(destValue);
};
const deleteTemplate = async (id: string, removeItem: (value: string) => void) => {
  isLoading.value = true;
  const { error } = await TemplatesRequests.deleteTemplateTransfer(id);
  isLoading.value = false;

  if (error) {
    errorNotification(error);
    return;
  }

  successNotification();
  removeItem(id);
};
const getTemplateFilteredTransfers = (options = {}): ReturnType<typeof TemplatesRequests.getTemplateFilteredTransfers> => {
  return TemplatesRequests.getTemplateFilteredTransfers({
    filter: { paymentToolType: paymentToolType.value },
    ...options,
  });
};
const debouncedCommissionCalculation = useDebounceFn(onCalculateCommission, 500);
const onFormChanged = () => {
  commission.value = {} as ITransferCalculateResponse;
  debouncedCommissionCalculation();
};

watch(form, onFormChanged, { deep: true });
</script>
