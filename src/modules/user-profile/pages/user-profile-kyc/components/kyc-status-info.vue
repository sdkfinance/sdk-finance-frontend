<template>
  <div class="kyc-status-block">
    <div class="kyc-info-row">
      <div class="kyc-info-row__label">
        {{ $t('pages.user_profile_kyc.status') }}
      </div>
      <div class="kyc-info-row__value">
        <app-badge
          v-if="data.status"
          is-borderless
          is-background-transparent
          :label="`entity.identification_status.${(data.status.toLowerCase())}`"
          :status="data.status"/>
        <div v-else>
          {{ emptyChar }}
        </div>
      </div>
    </div>

    <div class="kyc-info-row">
      <div class="kyc-info-row__label">
        {{ $t('pages.user_profile_kyc.check_type') }}
      </div>
      <div class="kyc-info-row__value">
        {{ checkTypeValue }}
      </div>
    </div>

    <div class="kyc-info-row">
      <div class="kyc-info-row__label">
        {{ $t('pages.user_profile_kyc.upload_date') }}
      </div>
      <div class="kyc-info-row__value">
        {{ uploadDate }}
      </div>
    </div>

    <div class="kyc-info-row">
      <div class="kyc-info-row__label">
        {{ $t('pages.user_profile_kyc.check_date') }}
      </div>
      <div class="kyc-info-row__value">
        {{ checkDate }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { IUserProfileDocument } from '@/services/requests/profiles/ProfileDocuments.types';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import config from '@/config';
import { formatDate } from '@/utils';
import { LocaleMessage } from 'vue-i18n';

@Component({
  components: { AppBadge },
})
export default class KycStatusInfo extends Vue {

  @Prop({ type: Object, default: () => ({}) }) readonly data!: IUserProfileDocument;

  readonly emptyChar: string = config.emptyChar;

  protected get isFileUploaded(): boolean {
    return !!this.data?.file?.createdAt;
  }

  protected get uploadDate(): string {
    return this.isFileUploaded
      ? formatDate(this.data.file.createdAt, false)
      : this.emptyChar;
  }

  protected get checkDate(): string {
    if (!this.data) {
      return this.emptyChar;
    }

    return this.data.status === 'APPROVED'
      ? formatDate(this.data?.updatedAt, false)
      : this.emptyChar;
  }

  protected get checkTypeValue(): LocaleMessage {
    if (this.isFileUploaded || Boolean(this.data?.documentIdentifier)) {
      return this.$t('pages.user_profile_kyc.uploaded_after_registration');
    }

    return this.emptyChar;
  }

}
</script>

<style lang="scss">
.kyc-status-block {
  @apply p-24 rounded-8 border border-blue-300;
}

.kyc-info-row {
  @apply mb-24;

  &__label {
    @apply text-sm text-blue-500 mb-8;
  }

  &__value {
    @apply text-sm font-semibold;
  }
}
</style>
