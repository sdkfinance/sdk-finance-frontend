<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="companyName">
      <app-input
        v-model="form.companyName"
        placeholder="placeholder.input.input_company_name"
        label="form.label.company_name"/>
    </app-form-item>
    <app-form-item
      prop="type">
      <app-select
        v-model="form.type"
        placeholder="placeholder.input.input_business_type"
        label="form.label.business_type"
        :options="businessTypesList"
        option-label="label"
        option-value="value"
        full-width/>
    </app-form-item>
    <app-form-item
      prop="vat">
      <app-input
        v-model="form.vat"
        placeholder="placeholder.input.input_vat_value"
        label="form.label.vat"/>
    </app-form-item>
    <app-form-item
      prop="administrator.firstName">
      <app-input
        v-model="form.administrator.firstName"
        placeholder="placeholder.input.input_first_name"
        label="form.label.first_name"/>
    </app-form-item>
    <app-form-item
      prop="administrator.lastName">
      <app-input
        v-model="form.administrator.lastName"
        placeholder="placeholder.input.input_last_name"
        label="form.label.last_name"/>
    </app-form-item>
    <app-form-item
      prop="administrator.email">
      <app-input
        v-model="form.administrator.email"
        placeholder="placeholder.input.input_email"
        :label="$t('form.label.email')"/>
    </app-form-item>
    <app-form-item
      prop="administrator.phone">
      <app-input
        v-model="form.administrator.phone"
        placeholder="placeholder.input.input_phone_number"
        :label="$t('form.label.phone')"/>
    </app-form-item>
    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { BUSINESS_TYPES_ARRAY } from '@/constants';
import { SimpleRequiredValidationRule, VatValidator } from '@/rules/validation';
import { UserInfoRequests } from '@/services/requests';
import { IUserBusiness } from '@/services/requests/profiles/UserProfile.types';
import {
  clearEmptyValue, cloneDeep, errorNotification,
  successNotification,
} from '@/utils';

const setForm = (userBusiness: IUserBusiness): IUserBusiness => {
  const {
    companyName, type, vat, administrator,
  } = userBusiness || {};
  return {
    companyName: companyName || '',
    type: type || '',
    vat: vat || '',
    administrator: {
      firstName: administrator?.firstName || '',
      lastName: administrator?.lastName || '',
      email: administrator?.email || '',
      phone: administrator?.phone || '',
    },
  };
};

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    AppSelect,
  },
})
export default class UserBusinessForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) private userBusiness!: IUserBusiness;

  protected form: IUserBusiness = setForm(this.userBusiness);

  readonly businessTypesList = BUSINESS_TYPES_ARRAY;

  protected isLoading: boolean = false;

  readonly userId: string = this.$route.params.id;

  public rules = {
    vat: VatValidator(),
    administrator: {
      firstName: SimpleRequiredValidationRule(),
      lastName: SimpleRequiredValidationRule(),
      email: [{ type: 'email', message: this.$t('validation.invalid_email') }],
    },
  };

  public async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const copyForm: IUserBusiness = cloneDeep(this.form);
    clearEmptyValue(copyForm);

    this.isLoading = true;
    const { error } = await UserInfoRequests.updateUserBusiness(this.userId, copyForm);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>
