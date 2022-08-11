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
      class="form-entrance form-entrance--registration"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <router-link
        :to="{ name: 'sign-in' }"
        class="back-pointer">
        <i class="icon-arrow-left"/>
        {{ $t('action.back') }}
      </router-link>

      <app-form-item
        prop="login"
        class="form-entrance__field">
        <app-input
          v-model.trim="form.login"
          name="email"
          autocomplete="on"
          label="form.label.login"
          placeholder="placeholder.input.login"/>
      </app-form-item>

      <div class="text-right">
        <button
          class="button-role button-as-text"
          @click.prevent="toggleMerchantAccount">
          {{ accountCreateTypeText }}
        </button>
      </div>

      <div
        v-if="isMerchantAccount"
        class="legal-type">
        <p>{{ $t('pages.entrance.registration.legal_type') }}:</p>

        <app-radio
          v-model="form.legalType"
          :options="merchantLegalTypes"
          class="type-options"/>
      </div>

      <app-button
        type="primary"
        native-type="submit"
        class="btn-main">
        {{ $t('action.sign_up') }}
      </app-button>

      <p class="entrance-form__footer text-right mt-10">
        {{ $t('pages.entrance.registration.have_otp') }}
        <router-link
          class="text-blue-600"
          :to="{ name: 'confirm-by-otp' }">
          {{ $t('pages.entrance.registration.confirm_by_otp') }}
        </router-link>
      </p>
    </app-form>

    <p class="entrance-form__footer">
      {{ $t('pages.entrance.registration.go_to') }}
      <router-link :to="{ name: 'sign-in' }">
        {{ $t('pages.entrance.sign_in') }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Ref,
} from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { EmailOrPhoneValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { IRegisterUser } from '@/services/requests/auth/Auth.types';
import { errorNotification } from '@/utils';
import { AuthRequests } from '@/services/requests';
import { IPlainObject } from '@/types/interfaces';
import AppRadio from '@/components/ui-framework/app-radio.vue';
import { IOption } from '@/types/interfaces/Options.interface';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    AppRadio,
  },
})
export default class RegistrationPage extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected isMerchantAccount: boolean = false;

  protected isLoading: boolean = false;

  protected merchantLegalTypes: IOption[] = [
    {
      label: 'pages.entrance.registration.individual',
      value: 'individual',
    },
    {
      label: 'pages.entrance.registration.corporation',
      value: 'corporation',
    },
  ]

  protected form: IRegisterUser = {
    login: '',
    role: 'individual',
    legalType: 'individual',
  };

  protected rules: IPlainObject = {
    login: EmailOrPhoneValidationRule(true),
    role: SimpleRequiredValidationRule(),
  };

  protected get accountCreateTypeText(): LocaleMessage {
    return this.isMerchantAccount
      ? this.$t('pages.entrance.registration.need_individual_account')
      : this.$t('pages.entrance.registration.need_merchant_account');
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    const sendData = { ...this.form };
    if (sendData.role === 'individual') {
      delete sendData.legalType;
    }

    this.isLoading = true;
    const { error } = await AuthRequests.registerUser(sendData);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    await this.$router.push({ name: 'confirm-by-otp', query: { login: this.form.login } });
  }

  protected toggleMerchantAccount() {
    this.form.role = this.isMerchantAccount ? 'individual' : 'merchant';
    this.isMerchantAccount = !this.isMerchantAccount;
  }

}
</script>

<style lang="scss">
.form-entrance--registration {
  .button-role {
    @apply text-right text-base text-blue-600 cursor-pointer mb-20 border-none;

    &:hover {
      @apply text-blue-accent;
    }
  }

  .legal-type {
    @apply text-left;

    .type-options {
      @apply flex flex-col mb-20;
    }
  }
}
</style>
