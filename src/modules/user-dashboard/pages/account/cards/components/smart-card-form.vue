<template>
  <app-form-wrapper>
    <template #title>
      {{ $t('pages.user_dashboard.cards.create_modal_title') }}
    </template>
    <app-form
      ref="form"
      :loading="isLoading"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleForm">
      <app-form-item
        prop="name">
        <app-input
          v-model="form.name"
          label="form.label.card_name"
          name="name"
          placeholder="placeholder.input.card_name"/>
      </app-form-item>

      <app-button
        native-type="submit">
        {{ $t('action.add_card') }}
      </app-button>
    </app-form>
  </app-form-wrapper>
</template>

<script lang="ts">
import {
  Component, Emit, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { ISmartCardCreatePayload } from '@/services/requests/smart-cards/SmartCards.types';
import { SmartCardsRequests } from '@/services/requests/smart-cards/SmartCardsRequests';
import { IPlainObject } from '@/types/interfaces';
import { errorNotification, successNotification } from '@/utils';

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
  }

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
  };

  @Emit('submitted')
  protected onSubmit(): boolean {
    return true;
  }

  protected async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

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
