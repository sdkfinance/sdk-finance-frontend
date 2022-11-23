<template>
  <div class="create-contract-main">
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
          placeholder="placeholder.input.name"
          label="form.label.contact_name"/>
      </app-form-item>
      <app-form-item
        prop="type">
        <app-select
          v-model="form.type"
          :options="types"
          option-label="label"
          option-value="value"
          placeholder="placeholder.select.select"
          label="form.label.contact_for"/>
      </app-form-item>
      <app-button
        native-type="submit"
        class="create-contract-main__button">
        {{ $t('action.next') }}
      </app-button>
    </app-form>
  </div>
</template>

<script lang="ts">

import {
  Component, Emit, Ref, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { OnChangeRequiredValidationRule, SimpleRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import { IOption } from '@/types/interfaces/Options.interface';

@Component({
  components: {
    AppSelect, AppInput, AppFormItem, AppForm, AppButton,
  },
})
export default class Main extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected isLoading: boolean = false;

  protected form: IPlainObject = {
    name: '',
    type: '',
  };

  protected rules: IPlainObject = {
    name: SimpleRequiredValidationRule(),
    type: OnChangeRequiredValidationRule(),
  };

  protected types: IOption[] = [
    {
      label: 'Individual',
      value: 'Individual',
    },
    {
      label: 'Merchant',
      value: 'Merchant',
    },
  ]

  @Emit('created')
  onCreated(): boolean {
    return true;
  }

  public async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    this.isLoading = false;

    this.onCreated();
  }

}
</script>

<style lang="scss">
.create-contract-main {
  @apply flex flex-col items-stretch justify-center max-w-520 ml-auto mr-auto w-full;

  &__button {
    @apply w-full max-w-300 ml-auto mr-auto block;
  }
}
</style>
