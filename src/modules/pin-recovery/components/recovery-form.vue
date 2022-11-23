<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="serial">
      <app-input
        v-model="form.serial"
        :label="$t('form.label.serial_number_voucher')"
        placeholder="placeholder.input.input_serial_number"/>
    </app-form-item>
    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.recover_pin') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import { ISerial } from '@/modules/pin-recovery/types/Serial.types';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { VouchersRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class RecoveryPinForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected form: ISerial = {
    serial: '',
  };

  protected rules = {
    serial: SimpleRequiredValidationRule(),
  };

  protected isLoading: boolean = false;

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await VouchersRequests.recoveryPin(this.form.serial);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
    this.appForm.resetFields();
  }

}
</script>
