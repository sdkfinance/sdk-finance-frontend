<template>
  <app-form
    ref="form"
    class="max-w-510"
    :loading="isLoading"
    :model="form"
    @submit.native.prevent="handleForm">
    <div class="security-section">
      <div class="security-section__title">
        {{ $t('pages.user_dashboard.security.two_factor_authentication') }}
      </div>
      <div class="security-section__content">
        <app-switch
          v-model="form.twoFactorsAuthEnabled"
          :full-width="true"
          disable-label="form.label.two_factor_auth_disabled"
          enable-label="form.label.two_factor_auth_enabled"
          :is-dynamic-label-color="true"
          :secondary="true">
          <template #afterLabel>
            <app-tooltip>
              <template #content>
                {{ $t('pages.user_dashboard.security.two_factor_authentication_info') }}
              </template>
              <span class="security-section__info">!</span>
            </app-tooltip>
          </template>
        </app-switch>
      </div>
    </div>
    <div class="security-section">
      <div class="security-section__title">
        {{ $t('pages.user_dashboard.security.transaction_notifications') }}
      </div>
      <div class="security-section__content">
        <app-switch
          v-model="form.transactionNotification.email"
          :full-width="true"
          label="form.label.send_email"
          class="mb-16"
          :is-dynamic-label-color="true"
          :secondary="true"/>
        <app-switch
          v-model="form.transactionNotification.phone"
          :full-width="true"
          :is-dynamic-label-color="true"
          label="form.label.send_sms"
          :secondary="true"/>
      </div>
    </div>
    <app-button
      type="primary"
      native-type="submit"
      class="submit-button"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppSwitch from '@/components/ui-framework/app-switch.vue';
import AppTooltip from '@/components/ui-framework/app-tooltip.vue';
import { IUserSecurity } from '@/services/requests/profiles/UserProfile.types';
import { Profile } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';
import {
  errorNotification,
  successNotification,
} from '@/utils';

@Component({
  components: {
    AppTooltip,
    AppForm,
    AppButton,
    AppSwitch,
  },
})
export default class ProfileSecurity extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected profileModule = getModule(Profile, this.$store);

  protected setForm(userInfo: IPlainObject): IUserSecurity {
    const {
      twoFactorsAuthEnabled, transactionNotification,
    } = userInfo || {};
    return {
      twoFactorsAuthEnabled,
      transactionNotification,
      authorizationNotification: {
        phone: false,
        email: false,
      },
    };
  }

  protected form: IUserSecurity = this.setForm(this.userInfo.security);

  protected isLoading: boolean = false;

  protected get userInfo(): IPlainObject {
    return this.profileModule.profile;
  }

  protected async handleForm(): Promise<void> {

    this.isLoading = true;
    const { error } = await this.profileModule.updateTwoFactorAuth(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>

<style lang="scss">
.security-section {
  @apply mb-40;

  &__title {
    @apply font-semibold mb-16 text-base;
  }

  &__info {
    @apply w-18 h-18 rounded-full inline-flex justify-center items-center bg-orange-main text-white text-10 ml-8 cursor-pointer font-bold;
  }
}
</style>
