<template>
  <loader-stub>
    <template v-if="isLoaded">
      <div class="user-profile">
        <form-block
          title="pages.user_profile.labels.login_credentials">
          <user-login-form
            :user-login="userInfo.contact"
            @on-updated="updateUserInfo"/>
        </form-block>
        <form-block
          title="pages.user_profile.labels.security">
          <user-security-form
            :user-security="userInfo.security"
            @on-updated="updateUserInfo"/>
        </form-block>
      </div>
    </template>
  </loader-stub>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import FormBlock from '@/components/form-block.vue';
import LoaderStub from '@/components/loader-stub.vue';
import config from '@/config';
import { UserInfoRequests } from '@/services/requests';
import { IUserInfoResponse } from '@/services/requests/profiles/UserProfile.types';
import { errorNotification } from '@/utils';

import UserLoginForm from './components/login-form.vue';
import UserSecurityForm from './components/security-form.vue';

@Component({
  components: {
    LoaderStub,
    FormBlock,
    UserLoginForm,
    UserSecurityForm,
  },
})
export default class UserLoginAndSecurity extends Vue {

  readonly emptyChar: string = config.emptyChar;

  protected userInfo: Partial<IUserInfoResponse> = {};

  protected isLoaded: boolean = false;

  protected isLoading: boolean = false;

  readonly userId: string = this.$route.params.id;

  created() {
    this.fetchData();
  }

  protected async fetchData(): Promise<void> {
    const { response, error } = await UserInfoRequests.getUserProfile(this.userId);

    if (error) {
      errorNotification(error);
      return;
    }

    if (response) {
      this.isLoaded = true;
      this.userInfo = response.profile;
    }
  }

  protected updateUserInfo(data: IUserInfoResponse): void {
    this.userInfo = data;
  }

}

</script>

<style lang="scss">
.user-profile {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 60px;
}
</style>
