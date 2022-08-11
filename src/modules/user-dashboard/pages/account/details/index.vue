<template>
  <account-details-block :data="bankDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { errorNotification } from '@/utils';
import { IUserBankAccount, IUserBankAccountRecord } from '@/services/requests/profiles/UserProfile.types';
import { BankAccountsRequests } from '@/services/requests/bank-accounts/BankAccountsRequests';
import AccountDetailsBlock from '@/modules/user-dashboard/components/account-details-block.vue';

@Component({
  inheritAttrs: false,
  components: {
    AccountDetailsBlock,
  },
})
export default class AccountDetails extends Vue {

  protected isLoading: boolean = false;

  protected serial: string = this.$route?.params?.serial || '';

  protected accounts: IUserBankAccount[] = [];

  protected get bankDetails(): IUserBankAccountRecord {
    return this.accounts[0]?.details || {} as IUserBankAccountRecord;
  }

  protected async getBankAccounts(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await BankAccountsRequests.viewMyBankAccounts({ filter: { coinSerial: this.serial } });
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.accounts = response?.records || [];
  }

  protected async created(): Promise<void> {
    await this.getBankAccounts();
  }

}
</script>
