<template>
  <div class="card-settings">
    <app-form
      ref="form"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item prop="name">
        <app-input
          v-model="form.name"
          :disabled="isCardNameInputDisabled"
          label="form.label.card_name" />
      </app-form-item>
      <app-form-item prop="active">
        <div class="card-settings__row">
          {{ $t('form.label.block_card') }}
          <app-switch
            v-model="form.active"
            :disabled="isStateToggleDisabled"
            secondary />
        </div>
      </app-form-item>
      <app-button
        class="card-settings__submit"
        :disabled="isUpdateButtonDisabled">
        {{ $t('action.update') }}
      </app-button>
    </app-form>
  </div>
</template>

<script lang="ts">
import { ISSUED_CARD_STATE } from '@sdk5/shared/constants';
import type { ISmartCardUpdatePayload, TUserCardState } from '@sdk5/shared/requests';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInfoModal, AppInput, AppModal, AppSwitch, InfoModalTypes } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

import type { TDisplayCardDetails } from '../types';

type IPlainObject = Record<string, any>;

@Component({
  components: {
    AppInfoModal,
    AppModal,
    AppSwitch,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class CardSettings extends Vue {
  @Ref('form') readonly appForm!: AppForm;

  @Ref('terminateModal') readonly terminateModal!: AppModal;

  @Prop({ type: Object, default: () => ({}) }) readonly card!: TDisplayCardDetails;

  @Prop({ type: Boolean, default: false }) readonly smartCardPage!: boolean;

  protected infoModalTypes = InfoModalTypes;

  protected cardId: string = this.$route.params?.cardId;

  protected form: ISmartCardUpdatePayload = {
    name: '',
    active: true,
  };

  protected get rules(): IPlainObject {
    if (this.isSmartCardSettingsPage) {
      return {
        name: SimpleRequiredValidationRule(),
      };
    }

    return {};
  }

  protected get issuedCardState() {
    if (this.isSmartCardSettingsPage) {
      return null;
    }

    return this.card.state as TUserCardState;
  }

  protected get isCardNameInputDisabled() {
    return !this.isSmartCardSettingsPage;
  }

  protected get isSmartCardSettingsPage() {
    return this.smartCardPage;
  }

  protected get isStateToggleDisabled() {
    return !this.isSmartCardSettingsPage;
    // TEMP
    // if (this.isSmartCardSettingsPage) {
    //   return false;
    // }

    // return this.issuedCardState === ISSUED_CARD_STATE.UNACTIVATED || this.issuedCardState === ISSUED_CARD_STATE.TERMINATED;
  }

  protected get isUpdateButtonDisabled() {
    return this.isCardNameInputDisabled && this.isStateToggleDisabled;
  }

  @Watch('card', { immediate: true, deep: true })
  protected setFormData(card: TDisplayCardDetails): void {
    this.form.name = card.name;

    if (this.isSmartCardSettingsPage) {
      this.form.active = !card.active;
      return;
    }

    this.form.active = this.issuedCardState === ISSUED_CARD_STATE.SUSPENDED;
  }

  @Emit('update-settings')
  protected emitUpdateSettingsEvent(form: ISmartCardUpdatePayload) {
    return form;
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.emitUpdateSettingsEvent(this.form);
  }
}
</script>

<style lang="scss">
.card-settings {
  @apply w-full max-w-400;

  &__row {
    @apply w-full flex justify-between items-center font-medium text-base text-gray-500;
  }

  &__submit {
    @apply block w-full sm:max-w-300 ml-auto mr-auto mt-50;
  }
}
</style>
