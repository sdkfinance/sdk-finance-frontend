<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <switch-block title="pages.user_profile.labels.transaction_notifications">
      <app-switch
        v-model="form.transactionNotification.email"
        full-width
        label="form.label.email"/>
      <app-switch
        v-model="form.transactionNotification.phone"
        full-width
        label="form.label.phone"/>
    </switch-block>
    <switch-block title="pages.user_profile.labels.authorization_notifications">
      <app-switch
        v-model="form.authorizationNotification.email"
        full-width
        label="form.label.email"/>
      <app-switch
        v-model="form.authorizationNotification.phone"
        full-width
        label="form.label.phone"/>
    </switch-block>
    <switch-block title="pages.user_profile.labels.dual_authentication">
      <app-switch
        v-model="form.twoFactorsAuthEnabled"
        full-width
        label="form.label.enable"/>
    </switch-block>
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
  Component, Emit,
  Prop, Ref, Vue,
} from 'vue-property-decorator';

import SwitchBlock from '@/components/switch-block.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import { ProfileRequests, UserInfoRequests } from '@/services/requests';
import { IUserInfoResponse, IUserSecurity } from '@/services/requests/profiles/UserProfile.types';
import { IApiResponse } from '@/types/interfaces';
import {
  clearEmptyValue,
  cloneDeep,
  errorNotification,
  successNotification,
} from '@/utils';

const setForm = (userSecurity: IUserSecurity): IUserSecurity => {
  const {
    twoFactorsAuthEnabled, transactionNotification, authorizationNotification,
  } = userSecurity || {};
  return {
    twoFactorsAuthEnabled,
    transactionNotification: { ...transactionNotification },
    authorizationNotification: { ...authorizationNotification },
  };
};

@Component({
  components: {
    AppForm,
    SwitchBlock,
    AppSwitch,
    AppButton,
  },
})
export default class UserSecurityForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) private userSecurity!: IUserSecurity;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  protected form: IUserSecurity = setForm(this.userSecurity);

  protected isLoading: boolean = false;

  readonly userId: string = this.$route.params.id;

  public rules = {};

  @Emit()
  onUpdated(data: IUserInfoResponse): IUserInfoResponse {
    return data;
  }

  protected updateUserSecurity(): Promise<IApiResponse<any>> {
    const copyForm: IUserSecurity = cloneDeep(this.form);
    clearEmptyValue(copyForm);

    if (this.isProfileOwner) {
      return ProfileRequests.updateMySecurity(copyForm);
    }

    return UserInfoRequests.updateUserSecurity(this.userId, copyForm);
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { response, error } = await this.updateUserSecurity();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.form = setForm(this.userSecurity);
      return;
    }

    successNotification();
    this.onUpdated(response.profile);
    this.form = setForm(response.profile.security);
  }

}
</script>
