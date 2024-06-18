<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <switch-block title="pages.user_profile.labels.transaction_notifications">
      <template #help>
        <app-info-tooltip :tooltip-content="`${$t('pages.user_dashboard.security.transaction_notification_info')}`" />
      </template>
      <app-switch
        v-model="form.transactionNotification.email"
        full-width
        label="form.label.email" />
      <app-switch
        v-model="form.transactionNotification.phone"
        full-width
        label="form.label.phone" />
    </switch-block>
    <switch-block title="pages.user_profile.labels.authorization_notifications">
      <app-switch
        v-model="form.authorizationNotification.email"
        full-width
        label="form.label.email" />
      <app-switch
        v-model="form.authorizationNotification.phone"
        full-width
        label="form.label.phone" />
    </switch-block>
    <switch-block title="pages.user_profile.labels.dual_authentication">
      <app-switch
        v-model="form.twoFactorsAuthEnabled"
        full-width
        label="form.label.enable" />
    </switch-block>
    <app-button
      v-if="isSubmitButtonVisible"
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import type { IUserInfoResponse, IUserSecurity } from '@sdk5/shared/requests';
import { ProfileRequests, UserInfoRequests } from '@sdk5/shared/requests';
import type { IApiResponse } from '@sdk5/shared/types';
import { clearEmptyValue, cloneDeep, errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppForm, AppInfoTooltip, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

import SwitchBlock from '../../../components/switch-block.vue';

const setForm = (userSecurity: IUserSecurity): IUserSecurity => {
  const { twoFactorsAuthEnabled, transactionNotification, authorizationNotification } = userSecurity || {};
  return {
    twoFactorsAuthEnabled,
    transactionNotification: { ...transactionNotification },
    authorizationNotification: { ...authorizationNotification },
  };
};

@Component({
  components: {
    AppInfoTooltip,
    AppForm,
    SwitchBlock,
    AppSwitch,
    AppButton,
  },
})
export default class UserSecurityForm extends Vue {
  @Ref('form') readonly appForm!: typeof AppForm;

  @Prop({ type: Object as PropType<IUserSecurity>, required: true }) private userSecurity!: IUserSecurity;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  @Prop({ type: Boolean, default: true }) isUpdatedAllowed!: boolean;

  protected form: IUserSecurity = setForm(this.userSecurity);

  protected isLoading: boolean = false;

  readonly userId: string = this.$route.params.id;

  public rules = {};

  protected get isSubmitButtonVisible() {
    return this.isUpdatedAllowed;
  }

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
    if (!this.isUpdatedAllowed) {
      return;
    }

    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

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

  @Watch('userSecurity', { immediate: true })
  protected userSecurityChangeHandler(value?: IUserSecurity) {
    if (value) {
      this.form = setForm(value);
    }
  }
}
</script>
