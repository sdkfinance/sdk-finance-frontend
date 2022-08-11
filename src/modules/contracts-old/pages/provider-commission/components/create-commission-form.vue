<template>
  <app-form
    ref="form"
    :loading="showSpinner"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="gateProviderId">
      <app-select
        v-model="form.gateProviderId"
        :options="providersList"
        full-width
        option-label="name"
        option-value="id"
        placeholder="placeholder.select.select"
        label="form.label.provider"/>
    </app-form-item>
    <app-form-item
      prop="currencyCode">
      <app-select
        v-model="form.currencyCode"
        :options="currencyList"
        full-width
        option-label="name"
        option-value="code"
        placeholder="placeholder.select.select"
        label="form.label.currency">
        <template #option="{scope}">
          {{ scope.name }} ({{ scope.code }})
        </template>
      </app-select>
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
import { OnChangeRequiredValidationRule } from '@/rules/validation';
import { ContractsRequests } from '@/services/requests';
import { successNotification, errorNotification } from '@/utils';
import { IProviderCreateBody } from '@/services/requests/contracts/Commissions.types';
import { ICurrency } from '@/services/requests/currencies/Currency.types';
import { IGateSetting } from '@/services/requests/gate-providers/GateProviders.types';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppSelect,
    AppButton,
  },
})
export default class CreateCommissionForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, required: true }) private currencyList!: ICurrency[];

  @Prop({ type: Array, required: true }) private providersList!: IGateSetting[];

  @Prop({ type: Boolean, default: false }) private isLoadingData!: boolean;

  public form: IProviderCreateBody = {
    gateProviderId: '',
    currencyCode: '',
  };

  public rules = {
    gateProviderId: OnChangeRequiredValidationRule(),
    currencyCode: OnChangeRequiredValidationRule(),
  };

  public isLoading: boolean = false;

  get showSpinner(): boolean {
    return this.isLoadingData || this.isLoading;
  }

  @Emit('created')
  onCreated(): boolean {
    return true;
  }

  public async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();
    const { contractId } = this.$route.params;
    if (!isValid) return;

    this.isLoading = true;
    const { error } = await ContractsRequests.createGateCommissionProfiles(contractId, this.form);
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
