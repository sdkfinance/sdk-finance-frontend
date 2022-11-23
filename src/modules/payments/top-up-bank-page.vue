<template>
  <app-step-controller
    class="top-up-bank"
    :total-steps="1"
    back-name="user-top-up-operations"
    is-close-visible>
    <app-form-wrapper class="max-w-540 ml-auto mr-auto">
      <template #title>
        {{ $t('pages.user_dashboard.payments.top_up_via_bank') }}
      </template>
      <div class="top-up-bank__subtitle">
        {{ $t('pages.user_dashboard.payments.select_the_account_you_want_to_top_up') }}
      </div>
      <account-select
        v-model="form.account"
        label="form.label.account"
        @change="getBankAccounts"/>
      <div class="top-up-bank__info">
        {{ $t('pages.user_dashboard.payments.use_these_data_to_top_up_your_account') }}
      </div>
      <account-details-block
        v-loading="isLoading"
        :data="bankDetails"/>
    </app-form-wrapper>
  </app-step-controller>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppStepController from '@/components/ui-kit/app-step-controller.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AccountDetailsBlock from '@/modules/user-dashboard/components/account-details-block.vue';
import AccountSelect from '@/modules/user-dashboard/components/account-select.vue';
import { BankAccountsRequests } from '@/services/requests/bank-accounts/BankAccountsRequests';
import { IUserBankAccountRecord } from '@/services/requests/profiles/UserProfile.types';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    AccountDetailsBlock,
    AccountSelect,
    AppStepController,
    AppFormWrapper,
  },
})
export default class TopUpBankPage extends Vue {

  protected isLoading: boolean = false;

  protected form: IPlainObject = {
    account: {},
  }

  protected bankDetails: IUserBankAccountRecord = {} as IUserBankAccountRecord;

  protected async getBankAccounts(): Promise<void> {
    await this.$nextTick();
    const { serial } = this.form.account || {};
    this.isLoading = true;
    const { response, error } = await BankAccountsRequests.viewMyBankAccounts({ filter: { coinSerial: serial } });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.bankDetails = response?.records?.[0]?.details || {} as IUserBankAccountRecord;
  }

}
</script>

<style lang="scss">
.top-up-bank {
  &__subtitle {
    @apply text-gray-500 text-xl mb-32 font-medium;
  }

  &__info {
    @apply mb-16 mt-24 text-gray-500;
  }
}

@media print {
  .app-form-wrapper__title,
  .top-up-bank__subtitle,
  .app-select,
  .top-up-bank__info,
  .app-step-controller__close,
  .app-step-controller__back {
    display: none !important;
  }
}
</style>
