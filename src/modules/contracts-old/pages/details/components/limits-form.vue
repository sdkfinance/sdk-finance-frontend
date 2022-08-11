<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="!isUpdate && isShowTxType"
      prop="txType">
      <app-select
        v-model="form.txType"
        :options="transactionsTypes"
        option-label="transactionType"
        option-value="transactionType"
        placeholder="placeholder.select.select_type"
        full-width
        :label="$t('form.label.transaction_type')"/>
    </app-form-item>
    <app-form-item
      v-if="!isUpdate"
      prop="qualifier">
      <app-select
        v-model="form.qualifier"
        :options="qualifierList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select"
        full-width
        :label="$t('form.label.qualifier')"/>
    </app-form-item>
    <app-form-item prop="value">
      <app-input
        v-model="form.value"
        placeholder="placeholder.input.input_value"
        :label="$t('form.label.value')"/>
    </app-form-item>
    <app-form-item
      v-if="!isUpdate"
      prop="timeUnit">
      <app-select
        v-model="form.timeUnit"
        :options="timeUnitsList"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select"
        full-width
        :label="$t('form.label.time_unit')"/>
    </app-form-item>

    <app-form-item prop="active">
      <app-switch
        v-model="form.active"
        :label="$t('form.label.active')"/>
    </app-form-item>

    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ isUpdate ? $t('action.update') : $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import {
  OnChangeRequiredValidationRule,
  SimpleRequiredValidationRule,
  NumberRangeValidationRule,
} from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import { TIME_UNITS_ARRAY, QUALIFIER_ARRAY } from '@/constants';
import {
  ILimitBody,
} from '@/services/requests/contracts/Commissions.types';
import { amountRulesParams } from '@/modules/contracts-old/constants';
import { cloneDeep } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
    AppSwitch,
  },
})
export default class LimitsForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean;

  @Prop({ type: Boolean, default: true }) readonly isShowTxType!: boolean;

  @Prop({ type: Array, default: () => ([]) }) readonly transactionsTypes!: string[];

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: Required<ILimitBody>;

  readonly timeUnitsList = TIME_UNITS_ARRAY;

  readonly qualifierList = QUALIFIER_ARRAY;

  protected form: ILimitBody = {
    txType: null,
    productId: null,
    qualifier: null,
    timeUnit: null,
    value: null,
    active: true,
  };

  protected rules: IPlainObject = {
    txType: OnChangeRequiredValidationRule(),
    productId: SimpleRequiredValidationRule(),
    qualifier: OnChangeRequiredValidationRule(),
    timeUnit: OnChangeRequiredValidationRule(),
    value: NumberRangeValidationRule(...amountRulesParams),
  }

  @Emit('submit')
  protected onSubmit(): { isUpdate: boolean; form: ILimitBody } {
    return { isUpdate: this.isUpdate, form: this.form };
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.onSubmit();
  }

  created() {
    if (this.isUpdate) {
      this.form = cloneDeep(this.formData);
    }
  }

}
</script>
