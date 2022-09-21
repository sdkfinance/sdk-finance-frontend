<template>
  <app-step-controller
    :total-steps="1"
    back-name="user-make-payment-operations"
    is-close-visible>
    <template #default>
      <app-form-wrapper class="max-w-540 ml-auto mr-auto">
        <template #title>
          {{ $t('pages.user_dashboard.payments.bank_transfer_title') }}
        </template>
        <app-form
          ref="form"
          key="form"
          :loading="isLoading"
          :model="form"
          :rules="rules"
          @submit.native.prevent="handleForm">
          <app-form-item prop="name">
            <app-input
              v-model.trim="form.name"
              name="name"
              size="big"
              autocomplete="off"
              label="form.label.company_or_iban"
              placeholder="form.label.company_or_iban"/>
          </app-form-item>
          <app-button
            class="submit-button"
            native-type="submit">
            {{ $t('action.next') }}
          </app-button>
        </app-form>
      </app-form-wrapper>
    </template>
  </app-step-controller>
</template>

<script lang="ts">
import {
  Vue, Component, Ref,
} from 'vue-property-decorator';
import AppStepController from '@/components/ui-kit/app-step-controller.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import { IPlainObject } from '@/types/interfaces';
import { successNotification } from '@/utils';

@Component({
  components: {
    AppButton,
    AppStepController,
    AppForm,
    AppInput,
    AppFormItem,
    AppFormWrapper,
  },
})
export default class BankTransfer extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  protected isLoading: boolean = false;

  protected form: IPlainObject = {
    name: '',
  }

  protected rules: IPlainObject = {};

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();
    if (isValid) {
      successNotification();
      await this.$router.push({ name: 'user-make-payment-operations' });
    }
  }

}
</script>
