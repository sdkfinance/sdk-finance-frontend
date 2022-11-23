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
            ref="form"
            key="form"
            :loading="isLoading"
            :model="form"
            :rules="rules"
            @submit.native.prevent="handleForm(nextStep)">
            <app-form-item prop="from">
              <account-select
                v-if="isAccountPage || isMerchant"
                v-model="form.from"
                option-value="serial"
                label="form.label.from_account"
                @input="resetTemplate"/>
              <card-select
                v-else
                v-model="form.from"
                label="form.label.from_card"
                @input="resetTemplate"/>
            </app-form-item>

            <app-form-item prop="to">
              <app-custom-select
                v-if="isAccountPage"
                v-model="form.to"
                label="form.label.to_account"
                placeholder="placeholder.input.input_account_number_or_choose_recipient"
                input-placeholder="placeholder.input.input_recipient_account_number"
                :on-load="getTemplateFilteredTransfers"
                @manual-templat="resetTemplate">
                <template #options="{setValueManual, removeItem, records}">
                  <app-custom-select-option
                    v-for="template in records"
                    :key="template.id"
                    :color="template.color"
                    :title="template.name"
                    :subtitle="`${template.paymentToolDetails.currency} ${template.paymentToolDetails.destValue}`"
                    @action-click="deleteTemplate(template.id, removeItem)"
                    @click="selectTemplate(template, setValueManual)"/>
                </template>
              </app-custom-select>
              <app-custom-select
                v-else
                v-model="form.to"
                label="form.label.to_card"
                placeholder="placeholder.input.input_card_number_or_choose_recipient"
                :on-load="getTemplateFilteredTransfers">
                <template #input>
                  <app-input-card-number
                    v-model="form.to"
                    is-masked-card-available
                    placeholder="placeholder.input.input_card_number"
                    :label="''"
                    @input="resetTemplate"/>
                </template>
                <template #options="{setValueManual, removeItem, records}">
                  <app-custom-select-option
                    v-for="template in records"
                    :key="template.id"
                    :color="template.color"
                    :title="template.name"
                    :subtitle="`${template.paymentToolDetails.currency} ${template.paymentToolDetails.destValue}`"
                    @action-click="deleteTemplate(template.id, removeItem)"
                    @click="selectTemplate(template, setValueManual)"/>
                </template>
              </app-custom-select>
            </app-form-item>

            <app-form-item
              prop="amount">
              <app-input
                v-model="form.amount"
                size="big"
                name="amount"
                autocomplete="off"
                label="form.label.transfer_amount"
                placeholder="placeholder.input.input_amount"/>
            </app-form-item>

            <operation-commission
              class="mb-36"
              :rows="2">
              <template #label-1>
                {{ $t('form.label.recipient_gets') }}
              </template>
              <template #value-1>
                {{ isCommissionCalculated ? '' : emptyChar }}
                {{ getProp(commission, 'recipientAmountPush') }} {{ getProp(commission, 'issuer.currency') }}
              </template>
              <template #label-2>
                {{ $t('form.label.fee') }}
              </template>
              <template #value-2>
                {{ isCommissionCalculated ? '' : emptyChar }}
                {{ getProp(commission, 'commissionAmountPush') }} {{ getProp(commission, 'issuer.currency') }}
              </template>
            </operation-commission>

            <app-button
              class="submit-button"
              native-type="submit">
              {{ $t('action.next') }}
            </app-button>
          </app-form>
          <div
            v-show="currentStep === 2"
            key="details">
            <transfer-details
              :data="commission"
              :is-account-page="isAccountPage"/>
            <app-button
              class="submit-button"
              native-type="button"
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
        <template #default="{onSubmit, onClose}">
          <app-info-modal
            title="pages.user_dashboard.payments.payment_success_title"
            subtitle="pages.user_dashboard.payments.payment_success_info"
            confirm-text="action.save_as_template"
            cancel-text="action.done"
            :is-cancel-visible="true"
            :type="infoModalTypes.success"
            is-buttons-in-row
            @cancel="onClose"
            @confirm="onSubmit"/>
        </template>
      </app-modal>
      <app-modal
        ref="saveTemplateModal"
        modal-body-class="max-w-520"
        is-full-width>
        <template #default="{onSubmit}">
          <save-template-form
            :operation-id="operationId"
            :payment-data="commission"
            :is-account-page="isAccountPage"
            @submitted="onSubmit"/>
        </template>
      </app-modal>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import { debounce } from 'lodash';
import {
  Component, Prop,
  Ref, Vue, Watch,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSelectCustomOption from '@/components/ui-framework/app-select/app-select-custom-option.vue';
import AppCustomSelect from '@/components/ui-kit/app-custom-select/app-custom-select.vue';
import AppCustomSelectOption from '@/components/ui-kit/app-custom-select/app-custom-select-option.vue';
import AppInputCardNumber from '@/components/ui-kit/app-input-card-number.vue';
import AppSimpleDetailsCard from '@/components/ui-kit/app-simple-details-card.vue';
import AppStepController from '@/components/ui-kit/app-step-controller.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AppInfoModal, { InfoModalTypes } from '@/components/ui-kit/modals/app-info-modal.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import config from '@/config';
import { ROLES } from '@/constants';
import SaveTemplateForm from '@/modules/payments/make-payment/components/save-template-form.vue';
import TransferDetails from '@/modules/payments/make-payment/components/transfer-details.vue';
import AccountSelect from '@/modules/user-dashboard/components/account-select.vue';
import CardSelect from '@/modules/user-dashboard/components/card-select.vue';
import OperationCommission from '@/modules/user-dashboard/components/operation-commission.vue';
import { OnChangeRequiredValidationRule, SimpleNumberValidationRule } from '@/rules/validation';
import { TransfersRequests } from '@/services/requests';
import { ISmartCardRecord } from '@/services/requests/smart-cards/SmartCards.types';
import { ITransferTemplateRecord } from '@/services/requests/templates/Templates.types';
import { TemplatesRequests } from '@/services/requests/templates/TemplatesRequests';
import {
  ITransferBody,
  ITransferCalculateResponse, TTransferPaymentType,
} from '@/services/requests/transfers/Transfers.types';
import { UserInstance } from '@/services/UserService';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, getProp, successNotification } from '@/utils';

@Component({
  components: {
    AccountSelect,
    CardSelect,
    SaveTemplateForm,
    TransferDetails,
    AppSimpleDetailsCard,
    AppInputCardNumber,
    AppCustomSelectOption,
    AppCustomSelect,
    AppButton,
    AppStepController,
    AppForm,
    AppInput,
    AppFormItem,
    AppSelect,
    AppFormWrapper,
    AppSelectCustomOption,
    AppInfoModal,
    OperationCommission,
    AppModal,
  },
})
export default class PaymentTo extends Vue {

    @Ref('form') readonly appForm!: AppForm;

    @Ref('successModal') readonly successModal!: AppModal;

    @Ref('saveTemplateModal') readonly saveTemplateModal!: AppModal;

    @Prop({ type: Boolean, default: false }) readonly isAccountPage!: boolean;

    protected smartCards: ISmartCardRecord[] = [];

    protected isLoading: boolean = false;

    protected operationId: string = '';

    readonly emptyChar: string = config.emptyChar;

    protected infoModalTypes = InfoModalTypes;

    protected commission: ITransferCalculateResponse = {} as ITransferCalculateResponse;

    protected form: IPlainObject = {
      from: '',
      to: '',
      amount: undefined,
      template: {},
    }

    protected rules: IPlainObject = {
      from: OnChangeRequiredValidationRule(),
      to: OnChangeRequiredValidationRule(),
      amount: SimpleNumberValidationRule(),
    };

    protected get isCommissionCalculated(): boolean {
      return !!this.commission?.status;
    }

    protected get paymentToolType(): TTransferPaymentType {
      return this.isAccountPage ? 'COIN' : 'SMART_CARD';
    }

    protected get isMerchant(): boolean {
      return UserInstance.isRole[ROLES.merchant];
    }

    protected getProp = getProp;

    @Watch('form', { deep: true })
    protected onFormChanged(): void {
      this.commission = {} as ITransferCalculateResponse;
      this.debouncedCommissionCalculation();
    }

    protected getPayload(): ITransferBody {
      const { from, to, amount } = this.form;

      return {
        paymentTool: {
          type: this.paymentToolType,
          srcValue: from,
          destValue: to,
        },
        amount,
        description: '',
      };
    }

    protected resetTemplate(): void {
      if (this.form.template?.id) {
        this.form.template = {};
        this.form.to = '';
      }
    }

    protected calculateCommissionFee(): ReturnType<typeof TransfersRequests.calculateCommissionFee> {
      if (this.form.template?.id) {
        const { amount, template: { id } } = this.form;
        return TemplatesRequests.calculateCommissionFee(id, amount);
      }

      const payload = this.getPayload();
      return TransfersRequests.calculateCommissionFee(payload);
    }

    protected async handleForm(onNextStep: Function): Promise<void> {
      const isValid: boolean = await this.appForm.validate();

      if (!isValid) return;

      if (this.isCommissionCalculated) {
        onNextStep();
        return;
      }

      await this.onCalculateCommission();
    }

    protected debouncedCommissionCalculation = debounce(this.onCalculateCommission, 500)

    protected async onCalculateCommission(): Promise<void> {
      if (!this.form.amount) {
        return;
      }
      const isValid: boolean = await this.appForm.validate();

      if (!isValid) return;

      this.isLoading = true;
      const { response, error } = await this.calculateCommissionFee();
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      this.commission = response || {} as ITransferCalculateResponse;
    }

    protected executeTransfer(): ReturnType<typeof TransfersRequests.executeTransfer | typeof TemplatesRequests.executeTransfer> {
      if (this.form.template?.id) {
        const { amount, template: { id } } = this.form;
        return TemplatesRequests.executeTransfer(id, amount);
      }

      const payload = this.getPayload();
      return TransfersRequests.executeTransfer(payload);
    }

    protected async onMakePayment(): Promise<void> {
      this.isLoading = true;
      const { response, error } = await this.executeTransfer();
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      this.setOperationId(response);

      const isCreateTemplate = await this.successModal.open();

      if (isCreateTemplate) {
        await this.saveTemplateModal.open();
      }
      await this.$router.push({ name: 'user-make-payment-operations' });
    }

    protected setOperationId(response: any): void {
      this.operationId = response?.process?.id || response?.businessProcessId;
    }

    protected selectTemplate(template: ITransferTemplateRecord, setValueManual: Function): void {
      const { paymentToolDetails: { srcId, srcValue, destValue }, amount } = template;
      this.form.from = this.isAccountPage ? srcValue : srcId;
      this.form.amount = amount;
      this.form.template = template;
      setValueManual(destValue);
    }

    protected async deleteTemplate(id: string, removeItem: Function): Promise<void> {
      this.isLoading = true;
      const { error } = await TemplatesRequests.deleteTemplateTransfer(id);
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      successNotification();
      removeItem(id);
    }

    protected getTemplateFilteredTransfers(options = {}): ReturnType<typeof TemplatesRequests.getTemplateFilteredTransfers> {
      return TemplatesRequests.getTemplateFilteredTransfers({
        filter: { paymentToolType: this.paymentToolType },
        ...options,
      });
    }

}
</script>
