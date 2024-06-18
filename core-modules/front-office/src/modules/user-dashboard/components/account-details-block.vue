<template>
  <div class="account-details">
    <app-simple-details-card :details="detailsList" />
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
import type { IUserBankAccountRecord } from '@sdk5/shared/requests';
import type { IDetailsValue } from '@sdk5/shared/types';
import { copyToClipboard, errorNotification, successNotification } from '@sdk5/shared/utils';
import { AppButton, AppSimpleDetailsCard } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'account-details-block',
  components: { AppButton, AppSimpleDetailsCard },
})
export default class AccountDetailsBlock extends Vue {
  @Prop({ type: Object, default: () => ({}) }) readonly data!: IUserBankAccountRecord;

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
