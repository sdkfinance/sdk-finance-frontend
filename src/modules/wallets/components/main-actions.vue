<template>
  <div class="wallet-main-actions">
    <action-button
      icon="icon-transfer-to"
      title="pages.wallets.transfer_to_wallet"
      @click="$emit('transfer-to-wallet')"/>
    <action-button
      icon="icon-transfer-from"
      title="pages.wallets.top_up_wallet"
      @click="$emit('top-up')"/>
    <action-button
      v-if="isWithdrawalAvailable"
      icon="icon-withdrawal"
      title="pages.wallets.withdrawal"
      @click="$emit('withdrawal')"/>
    <action-button
      icon="icon-exchange"
      title="pages.wallets.currency_exchange"
      @click="$emit('currency-exchange')"/>
    <action-button
      icon="icon-plus-circle"
      title="pages.wallets.add_new_wallet"
      @click="$emit('add-wallet')"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ActionButton from '@/modules/wallets/components/action-button.vue';

@Component({
  components: {
    ActionButton,
  },
})
export default class MainActions extends Vue {

  @Prop({ type: Boolean, default: true }) readonly isWithdrawalAvailable!: boolean

}
</script>

<style lang="scss">
.wallet-main-actions {
  display: flex;
  align-items: stretch;
  margin-left: 20px;
}
</style>
