<template>
  <app-form
    ref="appFormRef"
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
            <app-info-tooltip :tooltip-content="`${$t('pages.user_dashboard.security.two_factor_authentication_info')}`" />
          </template>
        </app-switch>
      </div>
    </div>
    <div class="security-section">
      <div class="security-section__title">
        {{ $t('pages.user_dashboard.security.transaction_notifications') }}
        <app-info-tooltip :tooltip-content="`${$t('pages.user_dashboard.security.transaction_notification_info')}`" />
      </div>
      <div class="security-section__content">
        <app-switch
          v-model="form.transactionNotification.email"
          :full-width="true"
          label="form.label.send_email"
          class="mb-16"
          :is-dynamic-label-color="true"
          :secondary="true" />
        <app-switch
          v-model="form.transactionNotification.phone"
          :full-width="true"
          :is-dynamic-label-color="true"
          label="form.label.send_sms"
          :secondary="true" />
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
import type { IUserSecurity } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppForm, AppInfoTooltip, AppSwitch } from '@sdk5/ui-kit-front-office';
import type { Ref } from 'vue';
import { defineComponent, ref } from 'vue';
import { getModule } from 'vuex-module-decorators';

type IPlainObject = Record<string, any>;

export default defineComponent({
  name: 'ProfileSecurity',
  components: {
    AppInfoTooltip,
    AppForm,
    AppButton,
    AppSwitch,
  },
  setup() {
    const appFormRef = ref(null) as unknown as Ref<InstanceType<typeof AppForm>>;
    const isLoading = ref(false);
    const form = ref({} as IUserSecurity);

    const setForm = (userInfo: IPlainObject): IUserSecurity => {
      const { twoFactorsAuthEnabled, transactionNotification } = userInfo || {};
      return {
        twoFactorsAuthEnabled,
        transactionNotification,
        authorizationNotification: {
          phone: false,
          email: false,
        },
      };
    };

    return {
      isLoading,
      form,
      appFormRef,
      setForm,
    };
  },
  data() {
    return {
      profileModule: getModule(Profile, this.$store),
    };
  },
  computed: {
    userInfo(): IPlainObject {
      return this.profileModule.profile;
    },
  },
  watch: {
    userInfo: {
      immediate: true,
      handler(value) {
        this.form = this.setForm(value.security);
      },
    },
  },
  methods: {
    async handleForm(): Promise<void> {
      this.isLoading = true;
      const { error } = await this.profileModule.updateTwoFactorAuth(this.form);
      this.isLoading = false;

      if (error) {
        errorNotification(error);
        return;
      }

      successNotification();
    },
  },
});
</script>

<style lang="scss">
.security-section {
  @apply mb-40;

  &__title {
    @apply inline-flex items-center font-semibold mb-16 text-base;
  }

  &__info {
    @apply w-18 h-18 rounded-full inline-flex justify-center items-center bg-orange-main text-white text-10 ml-8 cursor-pointer font-bold;
  }
}
</style>
