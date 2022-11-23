<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="login">
      <app-input
        v-model="form.login"
        placeholder="placeholder.input.input_login"
        label="form.label.email_of_phone"/>
    </app-form-item>
    <app-form-item
      prop="role">
      <app-select
        v-model="form.role"
        :options="roles"
        option-label="label"
        option-value="value"
        placeholder="placeholder.select.select_role"
        full-width
        label="form.label.system_role"/>
    </app-form-item>
    <!--    Temporary hidden, because backend don't work with it-->
    <!--    <app-form-item prop="isShowOrganizationId">-->
    <!--      <app-switch-->
    <!--        v-model="isShowOrganizationId"-->
    <!--        :label="$t('form.label.link_to_existing_organization')"-->
    <!--        @change="resetFormFields(['organizationId'])"/>-->
    <!--    </app-form-item>-->
    <!--    <app-form-item-->
    <!--      v-if="isShowOrganizationId"-->
    <!--      key="organizationId"-->
    <!--      prop="organizationId">-->
    <!--      <app-select-->
    <!--        v-model="form.organizationId"-->
    <!--        :options="organizations"-->
    <!--        option-label="name"-->
    <!--        option-value="id"-->
    <!--        placeholder="placeholder.input.input_organization_id"-->
    <!--        full-width-->
    <!--        :label="$t('form.label.organization_id')"/>-->
    <!--    </app-form-item>-->
    <app-button
      type="primary"
      :secondary="true"
      native-type="submit"
      full-width>
      {{ $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import { ROLES, SIMPLE_ROLES_ARRAY } from '@/constants';
import { EmailOrPhoneValidationRule, OnChangeRequiredValidationRule } from '@/rules/validation';
import { IOrganizationRecord } from '@/services/requests/organizations/Organizations.types';
import { IUserCreateBody } from '@/services/requests/users/Users.types';
import { IPlainObject } from '@/types/interfaces';

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
export default class UserForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  @Prop({ type: Array, default: false }) readonly organizations!: IOrganizationRecord[];

  protected isShowOrganizationId: boolean = false;

  protected roles = SIMPLE_ROLES_ARRAY.filter((role) => !['cashier'].includes(role.value));

  protected form: IUserCreateBody = {
    login: '',
    organizationId: '',
    role: '',
    legalType: 'individual',
  };

  protected get isMerchant(): boolean {
    return this.form.role === ROLES.merchant;
  }

  protected get rules(): IPlainObject {

    return {
      login: EmailOrPhoneValidationRule(true),
      organizationId: OnChangeRequiredValidationRule(),
      role: OnChangeRequiredValidationRule(),
    };
  }

  @Emit('submit')
  protected onSubmit(form: IUserCreateBody): IUserCreateBody {
    return form;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;
    const sendData: IUserCreateBody = { ...this.form };

    if (!this.isShowOrganizationId) delete sendData.organizationId;
    if (!this.isMerchant) delete sendData.legalType;

    this.onSubmit(sendData);
  }

}
</script>
