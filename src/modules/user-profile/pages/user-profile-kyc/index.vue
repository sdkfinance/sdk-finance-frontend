<template>
  <loader-stub>
    <template v-if="isLoaded">
      <div class="max-w-852">
        <div class="user-profile profile-kyc"/>

        <div class="kyc-section">
          <h2 class="profile-kyc__headline">
            {{ $t('pages.user_profile_kyc.kyc_status') }}: <app-badge
              font-class="text-xl"
              is-borderless
              is-background-transparent
              :label="`entity.identification_status.${(identificationStatus)}`"
              :status="identificationStatus"/>
          </h2>
          <p>{{ $t('pages.user_profile_kyc.all_documents_must_be_approved') }}</p>
          <app-button
            class="mt-16"
            size="small"
            :disabled="isApproveButtonDisabled"
            @click.prevent.stop="approveIdentification">
            {{ $t('action.approve_profile') }}
          </app-button>

          <app-button
            v-if="!isIdentificationApproved"
            :disabled="isIdentificationDeclined"
            class="mt-16"
            size="small"
            @click.prevent.stop="declineIdentification">
            {{ $t('action.decline_profile') }}
          </app-button>
        </div>

        <div class="kyc-section">
          <div class="kyc-section__header">
            <h2 class="profile-kyc__headline">
              {{ $t('pages.user_profile_kyc.passport') }}
            </h2>
            <div class="headline-controls">
              <app-button
                v-if="passportData"
                :disabled="isPassportApproved || isPassportDeclined"
                size="small"
                @click.prevent.stop="declineDocument(passportData)">
                {{ $t('action.reject_passport') }}
              </app-button>
              <app-button
                v-if="passportData"
                :disabled="isPassportApproved || isPassportDeclined"
                size="small"
                @click.prevent.stop="approveDocument(passportData)">
                {{ $t('action.approve_passport') }}
              </app-button>
            </div>
          </div>
          <div class="kyc-content">
            <div class="kyc-content__block">
              <app-image
                v-if="passportImageUrl"
                :image-url="passportImageUrl"/>
              <div
                v-else
                class="kyc-content__block--placeholder">
                <img
                  width="57"
                  height="48"
                  src="/images/icons/image-placeholder.svg"
                  alt="Image was not uploaded">
                <p>{{ $t('pages.user_profile_kyc.image_not_uploaded') }}</p>
              </div>
            </div>
            <kyc-status-info
              :data="passportData"
              class="kyc-content__block"/>
          </div>
        </div>

        <div class="kyc-section">
          <div class="kyc-section__header">
            <h2 class="profile-kyc__headline">
              {{ $t('pages.user_profile_kyc.tax_id_number') }}
            </h2>
            <div class="headline-controls">
              <app-button
                v-if="taxIdData"
                :disabled="isTaxIdApproved || isTaxIdDeclined"
                size="small"
                @click.prevent.stop="declineDocument(taxIdData)">
                {{ $t('action.reject_tax_id') }}
              </app-button>
              <app-button
                v-if="taxIdData"
                :disabled="isTaxIdApproved || isTaxIdDeclined"
                size="small"
                @click.prevent.stop="approveDocument(taxIdData)">
                {{ $t('action.approve_tax_id') }}
              </app-button>
            </div>
          </div>
          <div class="kyc-content">
            <div class="kyc-content__block">
              <div
                v-if="taxIdNumber"
                class="manual-tax-id-number">
                {{ taxIdNumber }}

                <app-button
                  transparent
                  icon="icon-copy"
                  @click="copyData"/>
              </div>
              <app-image
                v-else-if="taxIdImageUrl"
                :image-url="taxIdImageUrl"/>
              <div
                v-else
                class="kyc-content__block--placeholder">
                <img
                  width="57"
                  height="48"
                  src="/images/icons/image-placeholder.svg"
                  alt="Image was not uploaded">
                <p>{{ $t('pages.user_profile_kyc.image_not_uploaded') }}</p>
              </div>
            </div>
            <kyc-status-info
              class="kyc-content__block"
              :data="taxIdData"/>
          </div>
        </div>

        <div class="kyc-section">
          <h2 class="profile-kyc__headline">
            {{ $t('pages.user_profile_kyc.reset_kyc_status') }}
          </h2>
          <p>{{ $t('pages.user_profile_kyc.reset_kyc_text') }}</p>
          <app-button
            class="mt-16"
            size="small"
            @click.prevent.stop="resetIdentification">
            {{ $t('action.reset_kyc_status') }}
          </app-button>
        </div>

        <confirm-modal
          ref="userActionConfirm"
          :title="confirmModalText"/>
      </div>
    </template>
  </loader-stub>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { ProfileDocumentsRequests, ProfileRequests } from '@/services/requests';
import { IUserInfoResponse } from '@/services/requests/profiles/UserProfile.types';
import { errorNotification, successNotification } from '@/utils';
import LoaderStub from '@/components/loader-stub.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import KycStatusInfo from '@/modules/user-profile/pages/user-profile-kyc/components/kyc-status-info.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import { getModule } from 'vuex-module-decorators';
import { UserProfile } from '@/store/modules';
import { IUserProfileDocument } from '@/services/requests/profiles/ProfileDocuments.types';
import ConfirmModal from '@/components/confirm-modal.vue';
import { LocaleMessage } from 'vue-i18n';
import { copyToClipboard } from '@/utils/copyToClipboard';
import AppImage from '@/components/ui-framework/app-image.vue';

const FILE_TYPES = {
  passport: 'passport',
  tax_id: 'tax_id',
};

const FILE_STATUS = {
  declined: 'DECLINED',
  approved: 'APPROVED',
  pending: 'PENDING',
};

const IDENTIFICATION_STATUS = {
  approved: 'approved',
  declined: 'declined',
};

@Component({
  components: {
    AppImage,
    LoaderStub,
    AppButton,
    KycStatusInfo,
    AppBadge,
    ConfirmModal,
  },
})
export default class UserProfileKYC extends Vue {

  @Ref('userActionConfirm') readonly actionConfirm!: ConfirmModal;

  protected userInfo: IUserInfoResponse = {} as IUserInfoResponse;

  readonly userProfileModule = getModule(UserProfile, this.$store);

  protected isLoaded: boolean = false;

  protected isLoading: boolean = false;

  protected pendingAndApprovedData: IUserProfileDocument[] = [];

  protected fileList: IUserProfileDocument[] = [];

  protected confirmModalText: LocaleMessage = this.$t('pages.user_profile_kyc.confirm_reset_identification');

  readonly orgId: string = this.$route.params?.organizationId;

  readonly userId: string = this.$route.params?.id;

  async created(): Promise<void> {
    await this.fetchData();
  }

  protected get identificationStatus(): string {
    return this.userProfileModule.identificationStatus;
  }

  protected get passportData(): IUserProfileDocument {
    const [pendingOrApprovedFile] = this.pendingAndApprovedData.filter(({ type }) => type === FILE_TYPES.passport) || [];

    if (!pendingOrApprovedFile) {
      const [declinedPassword] = this.fileList
        .filter(({ type, status }) => type === FILE_TYPES.passport && status === FILE_STATUS.declined) || [];

      return declinedPassword;
    }

    return pendingOrApprovedFile;
  }

  protected get taxIdData(): IUserProfileDocument {
    const [pendingOrApprovedTx] = this.pendingAndApprovedData.filter(({ type }) => type === FILE_TYPES.tax_id) || [];

    if (!pendingOrApprovedTx) {
      const [declinedTx] = this.fileList
        .filter(({ type, status }) => type === FILE_TYPES.tax_id && status === FILE_STATUS.declined) || [];

      return declinedTx;
    }

    return pendingOrApprovedTx;
  }

  protected get isApproveButtonDisabled(): boolean {
    if (this.isIdentificationApproved || !this.isAllDocsApproved) {
      return true;
    }

    return this.isIdentificationDeclined;
  }

  protected get taxIdNumber(): string {
    return this.taxIdData?.documentIdentifier || '';
  }

  protected get passportImageUrl(): string {
    return this.passportData?.file?.url || '';
  }

  protected get taxIdImageUrl(): string {
    return this.taxIdData?.file?.url || '';
  }

  protected get isAllDocsApproved(): boolean {
    return this.isPassportApproved && this.isTaxIdApproved;
  }

  protected get isIdentificationApproved(): boolean {
    return this.identificationStatus === IDENTIFICATION_STATUS.approved;
  }

  protected get isIdentificationDeclined(): boolean {
    return this.identificationStatus === IDENTIFICATION_STATUS.declined;
  }

  protected get isPassportApproved(): boolean {
    return this.passportData?.status === FILE_STATUS.approved;
  }

  protected get isPassportDeclined(): boolean {
    return this.passportData?.status === FILE_STATUS.declined;
  }

  protected get isTaxIdApproved(): boolean {
    return this.taxIdData?.status === FILE_STATUS.approved;
  }

  protected get isTaxIdDeclined(): boolean {
    return this.taxIdData?.status === FILE_STATUS.declined;
  }

  protected async fetchData(): Promise<void> {
    this.isLoading = true;

    const payload = {
      filter: {
        orgIds: [
          this.orgId,
        ],
        statuses: [
          FILE_STATUS.declined,
          FILE_STATUS.approved,
          FILE_STATUS.pending,
        ],
      },
    };

    const { response, error } = await ProfileDocumentsRequests.viewAllUploadedProfileDocuments(payload);

    this.isLoaded = true;
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.fileList = response.records;
    this.pendingAndApprovedData = response.records
      .filter((file: any) => file.status === FILE_STATUS.pending || file.status === FILE_STATUS.approved);
  }

  protected async approveIdentification(): Promise<void> {
    this.isLoading = true;
    const { error } = await ProfileRequests.approveIdentification(this.userId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.refreshAllData();
  }

  protected async declineIdentification(): Promise<void> {
    const { error } = await ProfileRequests.declineIdentification(this.userId);

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.refreshAllData();
  }

  protected async resetIdentification(): Promise<void> {
    const value = await this.actionConfirm.open();

    if (!value) {
      return;
    }

    this.isLoading = true;
    const { error } = await ProfileRequests.resetIdentification(this.userId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.refreshAllData();
  }

  protected async approveDocument({ id }: IUserProfileDocument): Promise<void> {
    this.isLoading = true;
    const { error } = await ProfileDocumentsRequests.approveDocument(id);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchData();
  }

  protected async declineDocument({ id }: IUserProfileDocument): Promise<void> {
    this.isLoading = true;
    const { error } = await ProfileDocumentsRequests.declineDocument(id);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    await this.fetchData();
  }

  protected async fetchUserProfile(): Promise<void> {
    await this.userProfileModule.getProfile(this.userId);
  }

  protected async refreshAllData(): Promise<void> {
    await Promise.all([
      this.fetchUserProfile(),
      this.fetchData(),
    ]);
  }

  protected copyData(): void {
    try {
      copyToClipboard(this.taxIdNumber);
      successNotification('notification.copied');
    } catch (error) {
      errorNotification('notification.copy_failed');
    }
  }

}

</script>

<style lang="scss">
.kyc-section {
  @apply mb-56;

  &__header {
    @apply flex justify-between mb-24;
  }
}

.profile-kyc {
  &__headline {
    @apply text-xl font-semibold mb-8;
  }
}

.kyc-content {
  @apply flex justify-between;

  &__block {
    @apply min-w-410 max-w-410 max-h-300;

    &--placeholder {
      @apply p-24 rounded-8 border border-blue-300 w-410 min-h-300 flex items-center justify-center flex-col
        text-blue-500;

      img {
        @apply mb-16;
      }
    }
  }
}

.manual-tax-id-number {
  @apply font-medium flex align-middle py-11 pl-14 pr-2 rounded-8 border border-blue-300 justify-between
    items-center;
}
</style>
