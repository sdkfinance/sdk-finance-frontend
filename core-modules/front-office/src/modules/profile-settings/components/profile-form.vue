<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item prop="namePlain.first">
      <app-input
        v-model="form.namePlain.first"
        placeholder="placeholder.input.input_name"
        label="form.label.name" />
    </app-form-item>
    <app-form-item prop="namePlain.last">
      <app-input
        v-model="form.namePlain.last"
        placeholder="placeholder.input.input_surname"
        label="form.label.surname" />
    </app-form-item>
    <app-form-item prop="namePlain.middle">
      <app-input
        v-model="form.namePlain.middle"
        placeholder="placeholder.input.input_middle_name"
        label="form.label.middle_name" />
    </app-form-item>
    <app-form-item prop="description">
      <app-input
        v-model="form.description"
        placeholder="placeholder.input.input_description"
        label="form.label.description" />
    </app-form-item>
    <app-button
      v-if="isSubmitButtonVisible"
      type="primary"
      native-type="submit"
      full-width>
      {{ $t('action.update') }}
    </app-button>
  </app-form>
</template>

<script lang="ts">
import type { IUserInfo } from '@sdk5/shared/requests';
import { UserInfoRequests } from '@sdk5/shared/requests';
import { Profile } from '@sdk5/shared/store';
import type { IApiResponse } from '@sdk5/shared/types';
import { clearEmptyValue, cloneDeep, errorNotification, successNotification } from '@sdk5/shared/utils';
import { SimpleRequiredValidationRule } from '@sdk5/shared/validation';
import { AppButton, AppForm, AppFormItem, AppInput } from '@sdk5/ui-kit-front-office';
import type { PropType } from 'vue';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

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
  @Ref('form') readonly appForm!: typeof AppForm;

  @Prop({ type: Object as PropType<IUserInfo>, required: true }) private userInfo!: IUserInfo;

  @Prop({ type: Boolean, default: false }) readonly isProfileOwner!: boolean;

  @Prop({ type: Boolean, default: true }) isUpdatedAllowed!: boolean;

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

  protected get isSubmitButtonVisible() {
    return this.isUpdatedAllowed;
  }

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
    if (!this.isUpdatedAllowed) {
      return;
    }

    const isValid: boolean = await this.appForm.validate();

    if (!isValid) {
      return;
    }

    this.isLoading = true;
    const { error } = await this.updateUserInfo();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

  @Watch('userInfo', { immediate: true })
  protected userInfoChangeHandler(value?: IUserInfo) {
    if (value) {
      this.form = setForm(value);
    }
  }
}
</script>
