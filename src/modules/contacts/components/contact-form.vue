<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    :server-errors="serverErrors"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-if="isUpdate"
      prop="delete">
      <button
        class="dotted button-as-text"
        @click.prevent="$emit('delete', id)">
        {{ $t('action.delete_contact') }}
      </button>
    </app-form-item>
    <app-form-item prop="nickname">
      <app-input
        v-model="form.nickname"
        label="form.label.nickname"
        placeholder="placeholder.input.input_nickname"/>
    </app-form-item>
    <app-form-item prop="firstName">
      <app-input
        v-model="form.firstName"
        label="form.label.first_name"
        placeholder="placeholder.input.input_first_name"/>
    </app-form-item>
    <app-form-item prop="lastName">
      <app-input
        v-model="form.lastName"
        label="form.label.last_name"
        placeholder="placeholder.input.input_last_name"/>
    </app-form-item>
    <app-form-item prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        label="form.label.phone_number"
        placeholder="placeholder.input.input_phone_number"/>
    </app-form-item>
    <app-form-item prop="email">
      <app-input
        v-model="form.email"
        label="form.label.email"
        placeholder="placeholder.input.input_email"/>
    </app-form-item>

    <app-button
      class="btn-submit"
      full-width
      native-type="submit"
      type="primary">
      {{ isUpdate ? $t('action.update_contact') : $t('action.create_contact') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Vue, Ref, Emit, Watch, Prop,
} from 'vue-property-decorator';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { errorNotification } from '@/utils';
import { IApiResponse, IPlainObject } from '@/types/interfaces';
import { OnlyLetterValidator, PhoneValidator, SimpleRequiredValidationRule } from '@/rules/validation';
import { TServerError } from '@/types/interfaces/ServerError.interface';
import { IContactPayload, IContactRecord } from '@/services/requests/contact-book/Contacts.types';
import { ContactsRequests } from '@/services/requests/contact-book/ContactsRequests';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class ContactForm extends Vue {

  @Ref('form') readonly appForm!: AppForm;

  @Prop({ type: Boolean, default: false }) readonly isUpdate!: boolean;

  @Prop({ type: Object, default: () => ({}) }) readonly formData!: IContactRecord;

  protected isLoading: boolean = false;

  protected serverErrors: TServerError[] = [];

  protected id: string = '';

  protected form: IContactPayload = {
    nickname: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  }

  protected rules: IPlainObject = {
    nickname: SimpleRequiredValidationRule(),
    firstName: OnlyLetterValidator(),
    lastName: OnlyLetterValidator(),
    email: [{ type: 'email', message: this.$t('validation.invalid_email') }, SimpleRequiredValidationRule()],
    phoneNumber: PhoneValidator(true),
  }

  @Watch('formData', { immediate: true })
  protected setForm(data: IContactRecord): void {
    if (!data) return;
    const {
      id,
      nickname,
      firstName,
      lastName,
      email,
      phoneNumber,
    } = data;

    this.form = {
      nickname,
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    this.id = id;

  }

  @Emit('submit')
  protected onSubmit(): boolean {
    return true;
  }

  protected createContact(): Promise<IApiResponse<any>> {
    return ContactsRequests.createRecord(this.form);
  }

  protected updateContact(): Promise<IApiResponse<any>> {
    return ContactsRequests.updateRecord(this.id, this.form);
  }

  protected async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const sendMethod = this.isUpdate ? this.updateContact : this.createContact;

    const { error } = await sendMethod();

    this.isLoading = false;

    if (error) {
      errorNotification(error);
      this.serverErrors = error.errors;

      return;
    }

    this.onSubmit();
  }

}
</script>
