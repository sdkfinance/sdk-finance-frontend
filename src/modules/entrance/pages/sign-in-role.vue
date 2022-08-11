<template>
  <div class="entrance-form-container sign-in-role">
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
      :rules="{}"
      @submit.native.prevent="handleAuth">
      <app-select
        v-model="currentAccount"
        clearable
        full-width
        class="el-form-item"
        label="form.label.role"
        placeholder="placeholder.select.choose_role"
        value-key="login"
        :options="accounts"
        option-label="label"
        @change="onAccountChange"/>

      <app-form-item
        v-if="isOtpSend"
        prop="otp"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.otp"
          show-password
          name="otp"
          autocomplete="on"
          label="form.label.otp_code"
          placeholder="placeholder.input.otp_code"/>
      </app-form-item>

      <app-button
        type="primary"
        native-type="submit"
        class="btn-main">
        {{ $t('action.sign_in') }}
      </app-button>
    </app-form>

    <router-link
      :to="{ name: 'sign-in-manual'}"
      class="text-blue-600 link-manual">
      {{ $t('pages.entrance.sign_in_manual') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { UserData } from '@/store/modules';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';
import { ACCOUNTS, ROLES } from '@/constants';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';

const ACCOUNTS_PRODUCTION = ACCOUNTS.filter((account) => (
  ['Individual', 'Merchant', 'Administrator', 'Accountant', 'Compliance manager'].includes(account.label)));

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    AppSelect,
  },
})
export default class SignInRole extends Vue {

  protected userDataModule = getModule(UserData, this.$store);

  protected isOtpSend: boolean = false;

  protected form: IPlainObject = {
    login: '',
    password: '',
    otp: '',
  };

  protected currentAccount: IPlainObject = {};

  protected currentYear: number = new Date().getFullYear();

  protected isLoading: boolean = false;

  protected get accounts(): IPlainObject {
    return process.env.NODE_ENV === 'production' ? ACCOUNTS_PRODUCTION : ACCOUNTS;
  }

  protected get role(): string {
    return this.userDataModule.role;
  }

  protected created(): void {
    this.form.login = (this.$route.query.login && String(this.$route.query.login)) || '';
  }

  protected async handleAuth(): Promise<void> {
    const { login, password, otp } = this.form;

    this.isLoading = true;
    const { response, error } = this.isOtpSend
      ? await this.userDataModule.loginConfirm({ login, otp })
      : await this.userDataModule.login({ login, password });
    this.isLoading = false;

    if (error) {
      if (error.code === 'exception.confirmation_code.not_found') {
        errorNotification('notification.otp_incorrect');
        return;
      }

      errorNotification(error);
      return;
    }

    if (response.action === 'OTP_SENT') {
      successNotification('notification.otp_send');
      this.isOtpSend = true;
      return;
    }

    const routeName = this.role === ROLES.individual ? 'user-dashboard' : 'dashboard';

    await this.$router.push({ name: routeName });
  }

  protected onAccountChange(option: IPlainObject): void {
    this.form.login = option.login;
    this.form.password = option.password;
  }

}
</script>

<style lang="scss">
.sign-in-role {
  .link-manual {
    @apply text-base underline;
  }
}
</style>
