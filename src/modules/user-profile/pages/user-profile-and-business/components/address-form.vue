<template>
  <app-form
    ref="form"
    :loading="isLoading"
    class="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent="handleForm">
    <app-form-item
      prop="country">
      <app-select
        v-model="form.country"
        :options="countiesList"
        option-label="name"
        option-value="code"
        placeholder="placeholder.select.select"
        full-width
        label="form.label.country"/>
    </app-form-item>
    <app-form-item
      prop="city">
      <app-input
        v-model="form.city"
        placeholder="placeholder.input.input_city"
        label="form.label.city"/>
    </app-form-item>
    <app-form-item
      prop="street">
      <app-input
        v-model="form.street"
        placeholder="placeholder.input.input_street"
        label="form.label.street"/>
    </app-form-item>
    <app-form-item
      prop="houseNumber">
      <app-input
        v-model="form.houseNumber"
        placeholder="placeholder.input.input_house_number"
        label="form.label.house_number"/>
    </app-form-item>
    <app-form-item
      prop="zipCode">
      <app-input
        v-model="form.zipCode"
        placeholder="placeholder.input.input_zip_code"
        label="form.label.zip_code"/>
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
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';
import { UserInfoRequests } from '@/services/requests';
import { MixMaxValidation } from '@/rules/validation';
import {
  clearEmptyValue, cloneDeep, successNotification, errorNotification,
} from '@/utils';
import { COUNTRIES } from '@/constants';
import { IUserAddress } from '@/services/requests/profiles/UserProfile.types';

const setForm = (userAddress: IUserAddress): IUserAddress => {
  const {
    country, zipCode, city, street, houseNumber,
  } = userAddress || {};
  return {
    country: country || '',
    zipCode: zipCode || '',
    city: city || '',
    street: street || '',
    houseNumber: houseNumber || '',
  };
};

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
    AppButton,
    AppSelect,
  },
})
export default class UserAddressForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) private userAddress!: IUserAddress;

  protected form: IUserAddress = setForm(this.userAddress);

  protected isLoading: boolean = false;

  protected countiesList = COUNTRIES;

  readonly userId: string = this.$route.params.id;

  public rules = {
    zipCode: MixMaxValidation(5, 5),
  };

  public async handleForm(): Promise<void> {
    const isValid = await this.appForm.validate();

    if (!isValid) return;

    const copyForm: IUserAddress = cloneDeep(this.form);
    clearEmptyValue(copyForm);

    this.isLoading = true;
    const { error } = await UserInfoRequests.updateUserAddress(this.userId, copyForm);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    successNotification();
  }

}
</script>
