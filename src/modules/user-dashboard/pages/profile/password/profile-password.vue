<template>
  <div class="max-w-510">
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item prop="currentUserPassword">
        <app-input
          v-model="form.currentUserPassword"
          name="currentUserPassword"
          label="form.label.old_password"
          placeholder="placeholder.input.old_password"/>
      </app-form-item>
      <app-form-item prop="newUserPassword">
        <app-input
          v-model="form.newUserPassword"
          show-password
          name="newUserPassword"
          label="form.label.new_password"
          placeholder="placeholder.input.new_password"/>
      </app-form-item>
      <app-input-hint class="mb-40 text-lg"/>
    </app-form>

    <app-button
      type="primary"
      native-type="submit"
      @click="handleForm">
      {{ $t('action.update') }}
    </app-button>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppInputHint from '@/components/ui-kit/app-input-hint.vue';
import { PasswordValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { ProfileRequests } from '@/services/requests';
import { IUserPassword } from '@/services/requests/profiles/UserProfile.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppInputHint,
    AppFormItem,
    AppForm,
    AppButton,
    AppInput,
  },
})
export default class ProfilePassword extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected form: IUserPassword = {
    currentUserPassword: '',
    newUserPassword: '',
  };

  protected rules: IPlainObject = {
    currentUserPassword: SimpleRequiredValidationRule('change'),
    newUserPassword: PasswordValidationRule(),
  }

  protected isLoading: boolean = false;

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await ProfileRequests.updateMyPassword(this.form);
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
