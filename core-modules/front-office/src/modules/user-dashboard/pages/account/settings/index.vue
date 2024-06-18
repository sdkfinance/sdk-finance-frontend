<template>
  <div class="account-settings">
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item prop="name">
        <app-input
          v-model="form.name"
          label="form.label.account_name" />
      </app-form-item>
      <app-form-item prop="active">
        <div class="account-settings__row bg-bl">
          {{ $t('form.label.block_account') }}
          <app-switch
            v-model="form.active"
            secondary />
        </div>
      </app-form-item>
      <app-button class="account-settings__submit">
        {{ $t('action.update') }}
      </app-button>
    </app-form>

    <div
      v-if="coinList.length"
      class="account-settings__terminate">
      <button
        class="account-settings__button"
        @click="onDelete">
        {{ $t('action.close_account') }}
      </button>
      <div class="account-settings__terminate-info">
        {{ $t('pages.user_dashboard.account.close_message') }}
      </div>
    </div>
    <app-modal
      ref="deleteModal"
      is-centred
      is-full-width>
      <template #default="{ onSubmit, onClose }">
        <app-info-modal
          :title="$t('pages.user_dashboard.account.close_question', { accountName: account.name })"
          subtitle="pages.user_dashboard.account.close_question_info"
          :type="infoModalTypes.warning"
          confirm-text="action.close_account"
          @confirm="onDeleteAccount(onSubmit)"
          @cancel="onClose">
          <app-select
            v-if="needToTransfer"
            v-model="selectedAccount"
            full-width
            is-custom
            class="mb-48 w-full text-left"
            value-key="serial"
            placeholder="form.label.account_to_transfer"
            label="form.label.account_to_transfer"
            :options="coinList"
            :option-label="() => ''">
            <template #prefix="{ inputModel }">
              <app-select-custom-option
                :image="inputModel.image"
                :title="inputModel.name"
                :additional="getAmount(inputModel)" />
            </template>
            <template #option="{ scope }">
              <app-select-custom-option
                :image="scope.image"
                :title="scope.name"
                :additional="getAmount(scope)" />
            </template>
          </app-select>
        </app-info-modal>
      </template>
    </app-modal>
    <app-modal
      ref="successDeleteModal"
      is-centred
      is-full-width>
      <template #default="{ onSubmit }">
        <app-info-modal
          :title="$t('pages.user_dashboard.account.close_success', { accountName: account.name })"
          subtitle="pages.user_dashboard.account.close_success_info"
          :type="infoModalTypes.success"
          confirm-text="action.done"
          :is-cancel-visible="false"
          @confirm="onSubmit" />
      </template>
    </app-modal>
  </div>
</template>

<script lang="ts">
import type { ICoin } from '@sdk5/shared/requests';
import { WalletsRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import {
  AppButton,
  AppForm,
  AppFormItem,
  AppInfoModal,
  AppInput,
  AppModal,
  AppSelect,
  AppSelectCustomOption,
  AppSwitch,
  InfoModalTypes,
} from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import { UserCoins } from '../../../../../store/modules';

type IPlainObject = Record<string, any>;

const COMPONENTS = {
  AppSelectCustomOption,
  AppSelect,
  AppInfoModal,
  AppModal,
  AppSwitch,
  AppForm,
  AppFormItem,
  AppInput,
  AppButton,
} as const;

@Component({
  inheritAttrs: false,
  components: COMPONENTS,
})
export default class AccountSettings extends Vue {
  static components: typeof COMPONENTS;

  @Ref('form') readonly appForm!: AppForm;

  @Ref('deleteModal') readonly deleteModal!: AppModal;

  @Ref('successDeleteModal') readonly successDeleteModal!: AppModal;

  @Prop({ type: Object as PropType<ICoin>, default: () => ({}) }) readonly account!: ICoin;

  $props!: {
    account?: ICoin;
  };

  protected userCoinsModule = getModule(UserCoins, this.$store);

  protected isLoading: boolean = false;

  protected infoModalTypes = InfoModalTypes;

  protected serial: string = this.$route.params?.serial;

  protected selectedAccount: ICoin = this.coinList[0] || ({} as ICoin);

  protected form: { name: string; active: boolean } = {
    name: '',
    active: true,
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  };

  protected get coinList(): ICoin[] {
    return this.userCoinsModule.mappedCoins.filter(({ serial }) => serial !== this.serial);
  }

  protected get needToTransfer(): boolean {
    return this.account.availableAmount > 0;
  }

  @Watch('account', { immediate: true })
  protected setFormData(account: IPlainObject): void {
    this.form.name = account.name;
    this.form.active = !account.active;
  }

  @Watch('coinList', { immediate: true })
  protected setAccount(): void {
    [this.selectedAccount] = this.coinList;
  }

  @Emit('updated-settings')
  protected updatedSettings(): boolean {
    return true;
  }

  protected async onDelete(): Promise<void> {
    const isConfirm = await this.deleteModal.open();

    if (!isConfirm) {
      return;
    }

    await this.successDeleteModal.open();
    await this.$router.push({ name: 'user-dashboard-total-balance' });
  }

  protected async onDeleteAccount(callback: Function): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    const transferToCoinSerial: string = this.needToTransfer ? this.selectedAccount?.serial : '';

    const { error } = await WalletsRequests.closeAndTransfer(this.serial, transferToCoinSerial);

    if (error) {
      errorNotification(error);
      return;
    }

    callback();
  }

  protected getAmount(data: ICoin): string {
    return data?.currency ? `${data.currency.symbol}${data.availableAmount}` : '';
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;

    const { error } = await WalletsRequests.updateWallet({ ...this.form, active: !this.form.active, serial: this.serial });

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.updatedSettings();
  }
}
</script>

<style lang="scss">
.account-settings {
  @apply w-full max-w-400;

  &__row {
    @apply w-full flex justify-between items-center font-medium text-base text-gray-500;
  }

  &__submit {
    @apply block w-full sm:max-w-300 ml-auto mr-auto mt-50;
  }

  &__terminate {
    @apply mt-55;

    &-info {
      @apply text-base font-medium text-blue-500;
    }
  }

  &__button {
    @apply text-red-main text-base font-medium mb-4;
  }
}
</style>
