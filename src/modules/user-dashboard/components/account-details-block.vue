<template>
  <div class="account-details">
    <app-simple-details-card :details="detailsList"/>
    <div class="account-details__buttons">
      <app-button
        transparent
        icon="icon-copy"
        @click="copyData">
        {{ $t('action.copy') }}
      </app-button>
      <app-button
        transparent
        icon="icon-print"
        @click="printData">
        {{ $t('action.print') }}
      </app-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppSimpleDetailsCard from '@/components/ui-kit/app-simple-details-card.vue';
import { IUserBankAccountRecord } from '@/services/requests/profiles/UserProfile.types';
import { IDetailsValue } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';
import { copyToClipboard } from '@/utils/copyToClipboard';

@Component({
  components: { AppButton, AppSimpleDetailsCard },
})
export default class AccountDetailsBlock extends Vue {

  @Prop({ type: Object, default: () => ({}) }) readonly data!: IUserBankAccountRecord

  protected get detailsList(): IDetailsValue[] {
    return [
      {
        label: 'form.label.beneficiary',
        value: this.data.fullName,
        param: 'beneficiary',
      },
      {
        label: 'form.label.iban',
        value: this.data.iban,
        param: 'iban',
      },
      {
        label: 'form.label.swift',
        value: this.data.swift,
        param: 'swift',
      },
      {
        label: 'form.label.bic',
        value: this.data.bic,
        param: 'bic',
      },
      {
        label: 'form.label.name',
        value: this.data.name,
        param: 'name',
      },
      {
        label: 'form.label.beneficiary_address',
        value: this.data.address,
        param: 'address',
      },
    ];
  }

  protected copyData(): void {
    try {
      const text = this.detailsList.reduce((acc, { label, value }) => `${acc}${this.$t(label)}: ${value} \n`, '');
      copyToClipboard(text);
      successNotification('notification.copied');
    } catch (error) {
      errorNotification('notification.copy_failed');
    }
  }

  protected printData(): void {
    window.print();
  }

}
</script>

<style lang="scss">
.account-details {
  @apply w-full;

  &__buttons {
    @apply flex items-center sm:justify-end mt-20;

    .btn {
      width: initial !important;
      margin-right: initial !important;
      margin-left: initial !important;
    }
  }
}

@media print {
  .user-dashboard__header,
  .account-details__actions,
  .tabs,
  .account-details__buttons,
  .el-notification {
    display: none !important;
  }
}
</style>
