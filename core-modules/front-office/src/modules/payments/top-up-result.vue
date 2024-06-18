<template>
  <app-modal
    ref="topUpResultModal"
    is-centred
    is-full-width
    @closed="goToHomePage">
    <template #default>
      <app-info-modal
        :title="currentTopUpResultModalData.title"
        :subtitle="currentTopUpResultModalData.subtitle"
        :type="currentTopUpResultModalData.modalType"
        confirm-text="action.done"
        :is-cancel-visible="false"
        @confirm="goToHomePage" />
    </template>
  </app-modal>
</template>

<script lang="ts">
import { ROLES } from '@sdk5/shared/constants';
import { UserData } from '@sdk5/shared/store';
import { AppInfoModal, AppModal, InfoModalTypes } from '@sdk5/ui-kit-front-office';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

const COMPONENTS = {
  AppInfoModal,
  AppModal,
} as const;

@Component({
  name: 'top-up-result',
  components: COMPONENTS,
})
export default class TopUpResult extends Vue {
  static components: typeof COMPONENTS;

  @Ref('topUpResultModal') readonly topUpResultModal!: AppModal;

  protected userDataModule = getModule(UserData, this.$store);

  protected currentTopUpResultModalData = {
    title: 'You have successfully topped up your account',
    subtitle: 'You can review your transfer anytime  in your Transactions list',
    modalType: InfoModalTypes.success,
  };

  protected get role() {
    return this.userDataModule.role;
  }

  protected goToHomePage() {
    const routeName = this.role === ROLES.individual ? 'user-dashboard' : 'dashboard';
    this.$router.push({ name: routeName });
  }

  mounted() {
    this.topUpResultModal.open();
  }
}
</script>
