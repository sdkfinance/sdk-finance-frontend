<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_profile.user_contract') }}
    </template>
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item
        prop="personType">
        <app-select
          v-model="form.personType"
          :options="personTypes"
          option-label="label"
          option-value="value"
          placeholder="placeholder.select.select_type"
          full-width
          label="form.label.person_type"/>
      </app-form-item>

      <app-form-item
        prop="changeContractTo">
        <app-select
          v-model="form.changeContractTo"
          :options="contractList"
          option-label="name"
          option-value="id"
          placeholder="placeholder.select.select_type"
          full-width
          label="form.label.change_contract_to"/>
      </app-form-item>

      <app-button
        full-width
        type="primary"
        native-type="submit">
        {{ $t('action.update') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import {
  Component, Emit, Ref, Vue, Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import { PERSON_TYPES } from '@/constants';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { ContractsRequests } from '@/services/requests';
import { IContractRecord, TPersonTypes } from '@/services/requests/contracts/Contracts.types';
import { UserProfile } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

interface IPersonType {
  label: string;
  value: string;
}

interface IChangeContractForm {
  personType: TPersonTypes;
  changeContractTo: string;
}

@Component({
  components: {
    AppFormWrapper,
    AppForm,
    AppInput,
    AppFormItem,
    AppSelect,
    AppButton,
  },
})
export default class ChangeContractForm extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Emit('submit')
  protected submit(payload: any): any {
    return payload;
  }

  @Watch('form.personType', { immediate: true })
  onTypeChange(value: string) {
    if (value) {
      this.fetchData();
      this.form.changeContractTo = '';
    }
  }

  protected isLoading: boolean = false;

  protected userProfile = getModule(UserProfile, this.$store);

  protected contractList: IContractRecord[] = [];

  protected form: IChangeContractForm = {
    personType: '' as TPersonTypes,
    changeContractTo: '',
  }

  protected rules: IPlainObject = {
    personType: SimpleRequiredValidationRule(),
    changeContractTo: SimpleRequiredValidationRule(),
  };

  protected get personTypes(): IPersonType[] {
    return Object.entries(PERSON_TYPES).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  }

  protected created(): void {
    this.form.personType = this.userProfile.type as TPersonTypes;
  }

  protected async fetchData(): Promise<any> {
    const payload = {
      filter: {
        personTypes: [this.form.personType],
        types: [this.userProfile.role],
      },
    };

    this.isLoading = true;
    const { response, error } = await ContractsRequests.getRecords(payload);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.contractList = response?.records;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    const payload = {
      organizationId: this.$route.params.organizationId,
      contractId: this.form.changeContractTo,
    };

    const { error } = await ContractsRequests.changeUserContract(payload);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.submit(this.form);
  }

}
</script>
