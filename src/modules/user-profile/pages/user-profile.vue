<template>
  <dashboard-content-layout
    v-loading="isLoading"
    is-secondary>
    <template #title>
      {{ $t('pages.user_profile.title') }}
    </template>
    <template
      v-if="userFullInfo.createdAt"
      #actions>
      <app-button
        v-if="userFullInfo.banned"
        size="mini"
        @click="unbanUser">
        {{ $t('action.unban_user') }}
      </app-button>
      <app-button
        size="mini"
        @click="onDelete">
        {{ $t('action.delete_user') }}
      </app-button>
      <app-button
        v-if="userFullInfo.active"
        key="deactivate"
        size="mini"
        @click="toggleActivateUser(false)">
        {{ $t('action.deactivate') }}
      </app-button>
      <app-button
        v-else
        key="activate"
        size="mini"
        @click="toggleActivateUser(true)">
        {{ $t('action.activate') }}
      </app-button>
    </template>
    <tab-links
      :tabs="links"
      secondary/>
    <router-view/>
    <confirm-modal
      ref="confirmDeleteModal"
      title="placeholder.confirm_title"/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { IRouteConfig } from '@/types/interfaces';
import MainHead from '@/components/main-head.vue';
import TabLinks from '@/components/ui-kit/app-tab-links.vue';
import { IUserInfoResponse } from '@/services/requests/profiles/UserProfile.types';
import { UserProfile } from '@/store/modules';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { UsersRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import ConfirmModal from '@/components/confirm-modal.vue';
import { IUserRecord } from '@/services/requests/users/Users.types';
import { USER_PROFILE_CHILDREN } from '../routes/index';

@Component({
  components: {
    ConfirmModal,
    AppButton,
    DashboardContentLayout,
    MainHead,
    TabLinks,
  },
})
export default class UserProfilePage extends Vue {

  @Ref('confirmDeleteModal') readonly confirmDeleteModal!: ConfirmModal;

  readonly userId: string = this.$route.params.id;

  readonly userProfileModule = getModule(UserProfile, this.$store);

  protected isLoading: boolean = false;

  protected userInfo: IUserInfoResponse = {} as IUserInfoResponse;

  protected userFullInfo: IUserRecord = {} as IUserRecord;

  protected get links(): IRouteConfig[] {
    return USER_PROFILE_CHILDREN;
  }

  protected async created(): Promise<void> {
    this.isLoading = true;

    await Promise.all([
      this.fetchUserProfile(),
      this.fetchFullUserData(),
    ]);

    this.isLoading = false;
  }

  protected async fetchUserProfile(): Promise<void> {
    await this.userProfileModule.getProfile(this.userId);
  }

  protected async fetchFullUserData(): Promise<void> {
    const { response, error } = await UsersRequests.getUsers({
      filter: {
        ids: [this.userId],
      },
    });

    if (error) {
      errorNotification(error);
      return;
    }

    this.userFullInfo = response?.records?.[0] || {} as IUserRecord;
  }

  protected async unbanUser(): Promise<void> {
    const { error } = await UsersRequests.unban(this.userId);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchFullUserData();
  }

  protected async onDelete(): Promise<void> {
    const value = await this.confirmDeleteModal.open();
    if (!value) {
      return;
    }

    const { error } = await UsersRequests.delete(this.userId);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchFullUserData();
  }

  protected async toggleActivateUser(active: boolean): Promise<void> {
    const { error } = await UsersRequests.toggleActivate(this.userId, active);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchFullUserData();
  }

}
</script>
