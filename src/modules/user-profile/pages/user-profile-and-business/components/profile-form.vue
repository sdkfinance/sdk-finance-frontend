<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="namePlain.first">
      <app-input
        v-model="form.namePlain.first"
        placeholder="placeholder.input.input_name"
        label="form.label.name"/>
    </app-form-item>
    <app-form-item
      prop="namePlain.last">
      <app-input
        v-model="form.namePlain.last"
        placeholder="placeholder.input.input_surname"
        label="form.label.surname"/>
    </app-form-item>
    <app-form-item
      prop="namePlain.middle">
      <app-input
        v-model="form.namePlain.middle"
        placeholder="placeholder.input.input_middle_name"
        label="form.label.middle_name"/>
    </app-form-item>
    <app-form-item
      prop="description">
      <app-input
        v-model="form.description"
        placeholder="placeholder.input.input_description"
        label="form.label.description"/>
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
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import { UserInfoRequests } from '@/services/requests';
import { SimpleRequiredValidationRule } from '@/rules/validation';
import {
  clearEmptyValue, cloneDeep, successNotification, errorNotification,
} from '@/utils';
import { IUserInfo } from '@/services/requests/profiles/UserProfile.types';
import { Profile } from '@/store/modules';
import { IApiResponse } from '@/types/interfaces';

const setForm = (userInfo: IUserInfo): IUserInfo => {
  const { namePlain, nameIntl, description } = userInfo || {};
  return {
    namePlain: { ...namePlain },
    nameIntl: { ...nameIntl },
    description: description || '',
  };
};

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
  },
})
export default class UserProfileForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) private userInfo!: IUserInfo;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  protected profileModule = getModule(Profile, this.$store);

  protected form: IUserInfo = setForm(this.userInfo);

  protected isLoading: boolean = false;

  readonly userId: string = this.$route.params.id;

  public rules = {
    namePlain: {
      first: SimpleRequiredValidationRule(),
      last: SimpleRequiredValidationRule(),
    },
    description: SimpleRequiredValidationRule(),
  };

  protected updateUserInfo(): Promise<IApiResponse<any>> {
    const copyForm: IUserInfo = cloneDeep(this.form);
    clearEmptyValue(copyForm);

    copyForm.nameIntl = { ...copyForm.namePlain };

    if (this.isProfileOwner) {
      return this.profileModule.updatePerson({ person: copyForm });
    }

    return UserInfoRequests.updateUserProfileInfo(this.userId, copyForm);
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
