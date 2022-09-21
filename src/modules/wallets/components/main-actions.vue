<template>
  <div class="wallet-main-actions">
    <action-button
      icon="icon-transfer-to"
      title="pages.wallets.transfer_to_wallet"
      @click="$router.push({name: 'user-make-payment-operations', params})"/>
    <action-button
      icon="icon-transfer-from"
      title="pages.wallets.top_up_wallet"
      @click="$router.push({name: 'user-top-up-operations', params})"/>
    <action-button
      icon="icon-exchange"
      title="pages.wallets.currency_exchange"
      @click="$router.push({name: 'user-exchange-operations', params})"/>
    <action-button
      icon="icon-plus-circle"
      title="pages.wallets.add_new_wallet"
      @click="$emit('add-wallet')"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ActionButton from '@/modules/wallets/components/action-button.vue';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    ActionButton,
  },
})
export default class MainActions extends Vue {

  protected get params(): IPlainObject {
    return { backName: this.$route.name, ...(this.$route.params || {}) };
  }

}
</script>

<style lang="scss">
.wallet-main-actions {
  display: flex;
  align-items: stretch;
  margin-left: 20px;
}
</style>
