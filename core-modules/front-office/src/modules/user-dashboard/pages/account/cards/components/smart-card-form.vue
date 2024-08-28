<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_dashboard.in_system_cards.create_modal_title') }}
    </template>
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item prop="name">
        <app-input
          v-model="form.name"
          label="form.label.card_name"
          name="name"
          placeholder="placeholder.input.card_name" />
      </app-form-item>

      <app-button
        native-type="submit"
        full-width>
        {{ $t('action.add_card') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import type { ISmartCardCreatePayload } from '@sdk5/shared/requests';
import { SmartCardsRequests } from '@sdk5/shared/requests';
import { errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppFormWrapper, AppInput, AppModal } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Ref, Vue } from 'vue-property-decorator';

type IPlainObject = Record<string, any>;

@Component({
  components: {
    AppFormWrapper,
    AppForm,
    AppInput,
    AppFormItem,
    AppButton,
    AppModal,
  },
})
export default class SmartCardForm extends Vue {
  @Ref('form') readonly appForm!: AppForm;

  protected isLoading: boolean = false;

  protected form: ISmartCardCreatePayload = {
    name: '',
    associatedCoinSerial: this.$route.params.serial,
    active: true,
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  };

  @Emit('submitted')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { error } = await SmartCardsRequests.createUserCard(this.form);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.onSubmit();
  }
}
</script>
