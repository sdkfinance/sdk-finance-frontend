<template>
  <div class="checking-bank-account-info-block">
    <div class="checking-bank-account-info-block__text">
      {{ $t('pages.bank_accounts.checking_bank_account_information_modal.text') }}
    </div>
    <app-button
      type="secondary"
      native-type="button"
      size="big"
      full-width
      @click="doneButtonClickHandler">
      {{ $t('action.done') }}
    </app-button>
  </div>
</template>

<script lang="ts">
import { AppButton } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppButton,
};

@Component({
  name: 'checking-bank-account-info-block',
  components: COMPONENTS,
})
export default class CheckingBankAccountInfoBlock extends Vue {
  static components: typeof COMPONENTS;

  protected doneButtonClickHandler() {
    this.emitDoneEvent();
  }

  @Emit('done')
  protected emitDoneEvent() {}
}
</script>

<style lang="scss">
.checking-bank-account-info-block {
  @apply flex flex-col gap-y-[2rem];

  &__text {
    @apply text-gray-500 text-md leading-[1.25rem] font-medium;
  }
}
</style>
