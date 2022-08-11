<template>
  <div class="flex flex-col justify-between h-full">
    <app-form
      ref="form"
      :loading="isLoadingForm"
      class="form"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item prop="beginDate">
        <app-input label="form.label.start_date">
          <app-date-picker
            v-model="form.beginDate"
            full-width
            :prefix-icon="''"
            placeholder="placeholder.select.select"/>
        </app-input>
      </app-form-item>
      <app-form-item prop="endDate">
        <app-input label="form.label.end_date">
          <app-date-picker
            v-model="form.endDate"
            full-width
            :prefix-icon="''"
            placeholder="placeholder.select.select"/>
        </app-input>
      </app-form-item>
      <app-form-item
        prop="direction">
        <app-select
          v-model="form.direction"
          :options="directionList"
          :option-label="({ label }) => label"
          option-value="value"
          placeholder="placeholder.select.select"
          full-width
          label="form.label.direction"/>
      </app-form-item>
      <app-form-item
        prop="active">
        <app-select
          v-model="form.active"
          :options="statusList"
          full-width
          :option-label="({ label }) => label"
          option-value="value"
          placeholder="placeholder.select.select"
          label="form.label.status"/>
      </app-form-item>

      <app-button
        type="primary"
        native-type="submit"
        full-width>
        {{ isUpdate ? $t('action.update_rule') : $t('action.add_rule') }}
      </app-button>
    </app-form>
    <app-button
      v-if="isUpdate"
      type="primary"
      class="mt-auto"
      native-type="button"
      full-width
      @click="onDelete(formData)">
      {{ $t('action.delete_rule') }}
    </app-button>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { OnChangeRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import { COMMISSION_DIRECTION_ARRAY } from '@/constants';
import { ICommissionRule, ICommissionRulePayload } from '@/services/requests/contracts/Commissions.types';
import { ContractsRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import { IIssuer } from '@/services/requests/issuers/Issuers.types';
import { IOperationFlowRecord } from '@/services/requests/catalogs/Catalogs.types';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppSelect,
    AppButton,
    AppInput,
    AppDatePicker,
  },
})
export default class CommissionRuleForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, default: () => ([]) }) private issuerList!: IIssuer[];

  @Prop({ type: Array, default: () => ([]) }) private operationFlowList!: IOperationFlowRecord[];

  @Prop({ type: Boolean, default: false }) private isLoadingData!: boolean;

  @Prop({ type: Boolean, default: false }) private isUpdate!: boolean;

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: ICommissionRule;

  readonly commissionDirectionList = COMMISSION_DIRECTION_ARRAY;

  protected isLoading: boolean = false;

  protected get isLoadingForm() {
    return this.isLoading || this.isLoadingData;
  }

  protected directionList = [
    { value: 'IN', label: 'IN' },
    { value: 'OUT', label: 'OUT' },
    { value: 'SHARED', label: 'SHARED' },
  ];

  protected statusList = [
    { value: true, label: this.$t('form.label.active') },
    { value: false, label: this.$t('form.label.inactive') },
  ]

  protected created(): void {
    if (!this.isUpdate) return;

    const {
      active,
      beginDate,
      endDate,
      feeDirection,
    } = this.formData;

    this.form = {
      active,
      beginDate,
      endDate,
      direction: feeDirection,
    };
  }

  protected form: ICommissionRulePayload = {
    active: true,
    beginDate: '',
    endDate: '',
    direction: '',
  }

  protected rules: IPlainObject = {
    active: OnChangeRequiredValidationRule(),
    beginDate: OnChangeRequiredValidationRule(),
    endDate: OnChangeRequiredValidationRule(),
    direction: OnChangeRequiredValidationRule(),
  }

  @Emit('submitted')
  protected onSubmit(): boolean {
    return true;
  }

  @Emit('delete')
  protected onDelete<T>(data: T): T {
    return data;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const { id: ruleId } = this.formData;
    const { contractId } = this.$route.params;
    const { profileId } = this.$route.params;

    const { error } = this.isUpdate
      ? await ContractsRequests.updateCommissionRule(contractId, profileId, ruleId, this.form)
      : await ContractsRequests.createCommissionRule(contractId, profileId, this.form);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }

}
</script>
