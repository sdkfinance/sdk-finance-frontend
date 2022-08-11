<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="currentUserPassword">
      <app-input
        v-model="form.currentUserPassword"
        placeholder="placeholder.input.input_current_password"
        :label="$t('form.label.current')"/>
    </app-form-item>
    <app-form-item prop="newUserPassword">
      <app-input
        v-model="form.newUserPassword"
        placeholder="placeholder.input.input_new_password"
        :label="$t('form.label.new_password')"/>
    </app-form-item>
    <app-form-item prop="confirmPassword">
      <app-input
        v-model="form.confirmPassword"
        placeholder="placeholder.input.input_confirm_password"
        :label="$t('form.label.confirm_password')"/>
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
  Component, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import {
  SimpleRequiredValidationRule,
  SecondFieldMatchValidationRule,
  PasswordValidationRule,
} from '@/rules/validation';

import { ProfileRequests } from '@/services/requests';
import { successNotification, errorNotification } from '@/utils';
import {
  IUserPassword,
} from '@/services/requests/profiles/UserProfile.types';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class PasswordForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected form: IUserPassword = {
    currentUserPassword: '',
    newUserPassword: '',
    confirmPassword: '',
  };

  protected isLoading: boolean = false;

  protected get rules(): IPlainObject {
    return {
      currentUserPassword: SimpleRequiredValidationRule('change'),
      newUserPassword: PasswordValidationRule(),
      confirmPassword: SecondFieldMatchValidationRule(this.form.newUserPassword),
    };
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const { newUserPassword, currentUserPassword } = this.form;

    this.isLoading = true;
    const { error } = await ProfileRequests.updateMyPassword({ newUserPassword, currentUserPassword });
    this.isLoading = false;

    await this.appForm.resetFields();

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>
