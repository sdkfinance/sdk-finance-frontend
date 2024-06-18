<template>
  <loader-stub>
    <template v-if="profile.person">
      <div class="user-profile">
        <form-block
          title="pages.user_profile.labels.profile_information"
          additional-height="40px">
          <template #additional>
            <div>
              <strong>{{ $t('pages.profile.labels.type') }}:</strong> {{ profile.type || emptyChar }}
            </div>
            <div>
              <strong>{{ $t('pages.user_profile.labels.identification') }}:</strong> {{ profile.status || emptyChar }}
            </div>
          </template>
          <profile-form
            :user-info="profile.person"
            :is-updated-allowed="isProfileSettingsUpdateAllowed"
            is-profile-owner />
        </form-block>
        <form-block title="pages.user_profile.labels.login_credentials">
          <profile-login-form
            :user-login="profile.contact"
            :is-updated-allowed="isProfileSettingsUpdateAllowed"
            is-profile-owner
            @on-updated="updateUserInfo" />
        </form-block>
        <form-block title="pages.user_profile.labels.security">
          <profile-security-form
            :user-security="profile.security"
            :is-updated-allowed="isProfileSettingsUpdateAllowed"
            is-profile-owner
            @on-updated="updateUserInfo" />
        </form-block>
      </div>
    </template>
  </loader-stub>
</template>

<script lang="ts">
import config from '@sdk5/shared/config';
import { ROLES } from '@sdk5/shared/constants';
import { Profile } from '@sdk5/shared/store';
import type { IPlainObject, IProfile } from '@sdk5/shared/types';
import type { LocaleMessages } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import FormBlock from '../../../../components/form-block.vue';
import LoaderStub from '../../../../components/loader-stub.vue';
import ProfileLoginForm from '../../components/login-form.vue';
import ProfileForm from '../../components/profile-form.vue';
import ProfileSecurityForm from '../../components/security-form.vue';

@Component({
  components: {
    LoaderStub,
    FormBlock,
    ProfileForm,
    ProfileLoginForm,
    ProfileSecurityForm,
  },
})
export default class ProfileAndNotification extends Vue {
  readonly emptyChar: string = config.emptyChar;

  protected profileModule = getModule(Profile, this.$store);

  protected isLoading: boolean = false;

  protected readonly updateProfileSettingsDisableForRoles = [ROLES.accountant];

  protected get currentRole() {
    return this.profileModule.role;
  }

  protected get isProfileSettingsUpdateAllowed() {
    return this.updateProfileSettingsDisableForRoles.indexOf(this.currentRole) === -1;
  }

  protected get profile(): IPlainObject {
    return this.profileModule.profile;
  }

  protected updateUserInfo(data: IProfile): void {
    this.profileModule.SET_PROFILE(data);
  }

  protected get contractType(): LocaleMessages | string {
    return this.profile.type ? this.$t(`entity.profile.contract_type.${this.profile.type}`) : this.emptyChar;
  }

  protected get identificationStatus(): LocaleMessages | string {
    return this.profile.status ? this.$t(`entity.profile.identification_status.${this.profile.status}`) : this.emptyChar;
  }
}
</script>
