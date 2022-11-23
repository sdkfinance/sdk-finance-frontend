<template>
  <loader-stub>
    <template v-if="isLoaded">
      <div class="user-profile">
        <form-block
          title="pages.user_profile.labels.profile_information"
          additional-height="40px">
          <template #additional>
            <div><strong>{{ $t('pages.user_profile.labels.type') }}:</strong> {{ userInfo.type || emptyChar }}</div>
            <div><strong>{{ $t('pages.user_profile.labels.identification') }}:</strong> {{ userInfo.status || emptyChar }}</div>
          </template>
          <user-profile-form :user-info="userInfo.person"/>
        </form-block>
        <form-block
          title="pages.user_profile.labels.address"
          additional-height="40px">
          <user-address-form :user-address="userInfo.address"/>
        </form-block>
        <form-block
          title="pages.user_profile.labels.business_information"
          additional-height="40px">
          <template #additional>
            <div><strong>{{ $t('pages.user_profile.labels.legal') }}:</strong> {{ userInfo.business.legal || emptyChar }}</div>
          </template>
          <user-business-form :user-business="userInfo.business"/>
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

import UserAddressForm from './components/address-form.vue';
import UserBusinessForm from './components/business-form.vue';
import UserProfileForm from './components/profile-form.vue';

@Component({
  components: {
    LoaderStub,
    FormBlock,
    UserProfileForm,
    UserAddressForm,
    UserBusinessForm,
  },
})
export default class UserProfileAndBusiness extends Vue {

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

}

</script>

<style lang="scss">
.user-profile {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 60px;
}
</style>
