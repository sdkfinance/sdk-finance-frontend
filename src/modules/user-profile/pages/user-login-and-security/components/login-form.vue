<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="email">
      <app-input
        v-model="form.email"
        :disabled="!isProfileOwner && !!userLogin.email"
        placeholder="placeholder.input.input_email"
        label="form.label.email"/>
    </app-form-item>
    <app-form-item
      prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        :disabled="!isProfileOwner && !!userLogin.phoneNumber"
        placeholder="placeholder.input.input_phone_number"
        label="form.label.phone"/>
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
  Component, Prop, Ref, Vue, Emit,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { UserInfoRequests, ProfileRequests } from '@/services/requests';
import { successNotification, errorNotification } from '@/utils';
import { IUserLogin, IUserInfoResponse } from '@/services/requests/profiles/UserProfile.types';
import { IApiResponse } from '@/types/interfaces';

const setForm = (userLogin: IUserLogin): IUserLogin => {
  const { phoneNumber, email } = userLogin || {};
  return {
    phoneNumber,
    email,
  };
};

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class UserLoginForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) private userLogin!: IUserLogin;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  protected form: IUserLogin = setForm(this.userLogin);

  protected isLoading: boolean = false;

  readonly userId: string = this.$route.params.id;

  public rules = {
    email: !this.isProfileOwner && [{ type: 'email', message: this.$t('validation.invalid_email') }, SimpleRequiredValidationRule()],
    phoneNumber: !this.isProfileOwner && SimpleRequiredValidationRule(),
  };

  @Emit()
  onUpdated(data: IUserInfoResponse): IUserInfoResponse {
    return data;
  }

  protected updateUserLogin(): Promise<IApiResponse<any>> {
    const login: string = this.userLogin.email ? this.form.phoneNumber || this.form.email : this.form.email;

    if (this.isProfileOwner) {
      return ProfileRequests.updateMyLogin(login);
    }

    return UserInfoRequests.updateUserLogin(this.userId, login);
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await this.updateUserLogin();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.form = setForm(this.userLogin);
      return;
    }

    successNotification();
    this.onUpdated(response.profile);
    this.form = setForm(response.profile.contact);
  }

}
</script>
