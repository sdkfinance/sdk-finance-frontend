<template>
  <app-form
    ref="form"
    :loading="isFromLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_contract_name"
        label="form.label.name"/>
    </app-form-item>
    <app-form-item
      prop="contractId">
      <app-select
        v-model="form.contractId"
        :options="mappedContractList"
        option-label="personType"
        option-value="id"
        placeholder="placeholder.select.select"
        full-width
        :label="$t('form.label.contract')"/>
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
  Component, Prop, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { OnChangeRequiredValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import { ContractsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import { ICustomContractBody } from '@/services/requests/contracts/Contracts.types';

interface IForm extends ICustomContractBody {
  contractId: string;
}

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class CustomContractForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Boolean, default: false }) readonly isLoadingData!: boolean;

  @Prop({ type: Array, default: () => ([]) }) readonly contractsList!: IPlainObject;

  protected isLoading: boolean = true;

  protected form: IForm = {
    name: '',
    contractId: '',
    copyLimits: true,
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    contractId: OnChangeRequiredValidationRule(),
  }

  protected get isFromLoading() {
    return this.isLoading && this.isLoadingData;
  }

  protected get mappedContractList(): IPlainObject {
    return this.contractsList.filter((item: { global: boolean }) => item.global);
  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { name, contractId, copyLimits } = this.form;
    const { error } = await ContractsRequests.createCustomContract(contractId, { name, copyLimits });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.onSubmit();
  }

}
</script>
