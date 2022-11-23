<template>
  <div class="entrance-form-container">
    <div class="hidden md:block form-entrance__logo">
      <img
        src="@/assets/images/logo.svg"
        alt="sdk.finance">
    </div>

    <app-form
      ref="form"
      :loading="isLoading"
      class="form-entrance"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleAuth">
      <router-link
        :to="{ name: 'sign-in' }"
        class="back-pointer">
        <i class="icon-arrow-left"/>
        {{ $t('action.back') }}
      </router-link>

      <recovery-success
        v-if="isSuccess"
        :login="form.login"
        :is-confirm="isConfirmPage"/>
      <template v-else>
        <app-form-item
          prop="login"
          class="form-entrance__field">
          <app-input
            v-model.trim="form.login"
            :disabled="isHasLogin"
            name="email"
            autocomplete="on"
            label="form.label.email_of_phone"
            placeholder="placeholder.input.login"/>
        </app-form-item>
        <app-form-item
          v-if="isConfirmPage"
          prop="otp"
          class="form-entrance__field">
          <app-input
            v-model.trim="form.otp"
            :disabled="isHasCode"
            name="code"
            autocomplete="new-password"
            label="form.label.code"
            placeholder="placeholder.input.code"/>
        </app-form-item>
        <app-form-item
          v-if="isConfirmPage"
          prop="newUserPassword"
          class="form-entrance__field">
          <app-input
            v-model.trim="form.newUserPassword"
            show-password
            name="new-password"
            autocomplete="new-password"
            label="form.label.new_password"
            placeholder="placeholder.input.new_password"/>
        </app-form-item>
        <app-input-hint
          v-if="isConfirmPage"
          class="mb-24"/>
        <app-button
          type="primary"
          native-type="submit"
          class="btn-main form-entrance__submit">
          {{ isConfirmPage ? $t('action.confirm') : $t('action.recover') }}
        </app-button>
        <div class="entrance-form__footer entrance__info entrance__info--center mt-24 mb-0">
          {{ $t('pages.entrance.recovery.return_to_the') }}
          <router-link
            :to="{ name: 'sign-in' }"
            class="entrance__link">
            {{ $t('action.sign_in') }}
          </router-link>
        </div>
      </template>
    </app-form>
  </div>
</template>

<script lang="ts">
import {
  Component, Ref,
  Vue, Watch,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppInputHint from '@/components/ui-kit/app-input-hint.vue';
import RecoverySuccess from '@/modules/entrance/components/recover-password/recovery-success.vue';
import { EmailOrPhoneValidationRule, PasswordValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { AuthRequests } from '@/services/requests';
import { IPasswordRecoveryConfirmBody } from '@/services/requests/auth/Auth.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AppInputHint,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    RecoverySuccess,
  },
})
export default class RecoverPassword extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected isSuccess: boolean = false;

  protected isHasLogin: boolean = false;

  protected isHasCode: boolean = false;

  protected isLoading: boolean = false;

  protected form: IPasswordRecoveryConfirmBody = {
    login: '',
    newUserPassword: '',
    otp: '',
  };

  protected rules: IPlainObject = {
    login: EmailOrPhoneValidationRule(true),
    newUserPassword: PasswordValidationRule(),
    otp: SimpleRequiredValidationRule(),
  };

  protected get isConfirmPage() {
    const { login, otp } = this.$route.query;
    return !!login || !!otp;
  }

  @Watch('$route.query', { immediate: true })
  protected onQueryChange(query: IPlainObject = {}) {
    this.isSuccess = false;
    const { login: loginRaw, otp: otpRaw } = query;
    try {
      const [login, otp] = atob(otpRaw).split('|');
      this.form.login = login;
      this.form.otp = otp;
      this.isHasLogin = true;
      this.isHasCode = true;
    } catch (error) {
      if (loginRaw) {
        this.form.login = loginRaw;
        this.isHasLogin = true;
      }
    }
  }

  protected async handleAuth(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    const { login } = this.form;

    const submitMethod = this.isConfirmPage
      ? AuthRequests.passwordRecoveryConfirm.bind(this, this.form)
      : AuthRequests.passwordRecovery.bind(this, login);

    this.isLoading = true;
    const { error } = await submitMethod();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.isSuccess = true;
  }

}
</script>
