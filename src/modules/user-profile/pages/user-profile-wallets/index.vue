<template>
  <loader-stub>
    <template v-if="isLoaded">
      <div class="user-profile-wallets">
        <wallet-card
          v-for="coin in coins"
          :key="coin.id"
          :coin="coin"/>
      </div>
    </template>
  </loader-stub>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { OrganizationsRequests } from '@/services/requests';
import { errorNotification } from '@/utils';
import LoaderStub from '@/components/loader-stub.vue';
import config from '@/config';
import WalletCard from './components/wallet-card.vue';
import { ICoin } from '../../../../services/requests/organizations/Coin.types';

@Component({
  components: {
    LoaderStub,
    WalletCard,
  },
})
export default class UserProfileWallets extends Vue {

  readonly emptyChar: string = config.emptyChar;

  protected coins: ICoin[] = [];

  protected isLoaded: boolean = false;

  readonly organizationId: string = this.$route.params.organizationId;

  created() {
    this.fetchData();
  }

  protected async fetchData(): Promise<void> {
    const { response, error } = await OrganizationsRequests.getWallets(this.organizationId);

    if (error) {
      errorNotification(error);
      return;
    }

    if (response) {
      this.isLoaded = true;
      this.coins = response.coins;
    }
  }

}

</script>

<style lang="scss">
.user-profile-wallets {
  display: grid;
  grid-template-columns: repeat(auto-fill, 343px);
  grid-column-gap: 24px;
  grid-row-gap: 24px;
}
</style>
