<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="!isUpdate"
      prop="key">
      <app-input
        v-model="form.key"
        label="form.label.key"/>
    </app-form-item>
    <app-form-item
      v-for="locale in locales"
      :key="locale"
      :prop="locale">
      <app-input
        v-model="form[locale]"
        :label="$t(`placeholder.input.${locale}`)"/>
    </app-form-item>
    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ isUpdate ? $t('action.update') : $t('action.create') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Prop, Watch, Emit, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import { IPlainObject } from '@/types/interfaces';
import {
  ILocalization,
} from '@/services/requests/i18n-records/Localization.interface';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class LocalizationForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) readonly localesObject!: object;

  @Prop({ type: Array, required: true }) readonly locales!: string[];

  @Prop({ type: Object, required: true }) readonly formData!: ILocalization;

  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean;

  private isLoading: boolean = false;

  private form: ILocalization = { id: 0, key: '' };

  private get rules(): IPlainObject {
    const result: IPlainObject = { key: '', ...this.localesObject };
    Object.keys(result).forEach((key: string): void => { result[key] = SimpleRequiredValidationRule(); });

    return result;
  }

  @Watch('formData.id', { immediate: true })
  private setFormData() {
    this.form = { ...this.formData };
  }

  @Emit('submit')
  private onSubmit(form: ILocalization): ILocalization {
    return form;
  }

  private async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;
    this.onSubmit(this.form);

  }

}
</script>
