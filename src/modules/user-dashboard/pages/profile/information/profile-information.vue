<template>
  <app-form
    ref="form"
    class="max-w-510"
    :loading="isLoading"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="namePlain.first">
      <app-input
        v-model="form.namePlain.first"
        placeholder="form.label.first_name"
        label="form.label.first_name"/>
    </app-form-item>
    <app-form-item
      prop="namePlain.last">
      <app-input
        v-model="form.namePlain.last"
        placeholder="form.label.last_name"
        label="form.label.last_name"/>
    </app-form-item>
    <app-form-item
      prop="email">
      <app-input
        v-model="form.email"
        placeholder="form.label.email_address"
        label="form.label.email_address"/>
    </app-form-item>
    <app-form-item
      prop="phoneNumber">
      <app-input
        v-model="form.phoneNumber"
        placeholder="form.label.phone_number"
        label="form.label.phone_number"/>
    </app-form-item>
    <app-form-item
      prop="dateOfBirth">
      <app-input label="form.label.date_of_birth">
        <app-date-picker
          v-model="form.dateOfBirth"
          full-width
          prefix-icon=" "
          format="dd.MM.yyyy"
          suffix-icon="icon-calendar"
          placeholder="form.label.date_of_birth"/>
      </app-input>
    </app-form-item>
    <app-button
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import { PhoneValidator, SimpleRequiredValidationRule } from '@/rules/validation';
import { IUserInfo } from '@/services/requests/profiles/UserProfile.types';
import { Profile } from '@/store/modules';
import { IApiResponse } from '@/types/interfaces';
import {
  clearEmptyValue, cloneDeep, errorNotification,
  successNotification,
} from '@/utils';

@Component({
  components: {
    AppDatePicker,
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class ProfileInformation extends Vue {

  @Ref('form') readonly appForm!: AppForm

  protected profileModule = getModule(Profile, this.$store);

  protected setForm(userInfo: IUserInfo): IUserInfo {
    const {
      namePlain, nameIntl, phoneNumber, email, dateOfBirth,
    } = userInfo || {};
    return {
      namePlain: { ...namePlain },
      nameIntl: { ...nameIntl },
      phoneNumber: phoneNumber || '',
      email: email || '',
      dateOfBirth: dateOfBirth || '',
    };
  }

  protected form: IUserInfo = this.setForm(this.userInfo);

  protected isLoading: boolean = false;

  protected rules = {
    namePlain: {
      first: SimpleRequiredValidationRule(),
      last: SimpleRequiredValidationRule(),
    },
    email: [{ type: 'email', message: this.$t('validation.invalid_email') }],
    phoneNumber: PhoneValidator(false),
  };

  protected get userInfo(): IUserInfo {
    return this.profileModule.personInfo;
  }

  protected updateUserInfo(): Promise<IApiResponse<any>> {
    const copyForm: IUserInfo = cloneDeep(this.form);
    clearEmptyValue(copyForm);

    copyForm.nameIntl = { ...copyForm.namePlain };

    return this.profileModule.updatePerson({ person: copyForm });
  }

  public async handleForm(): Promise<void> {
    const isValid: boolean = await this.appForm.validate();

    if (!isValid) return;

    this.isLoading = true;
    const { error } = await this.updateUserInfo();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>
