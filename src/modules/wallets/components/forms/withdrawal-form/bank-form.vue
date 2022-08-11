<template>
  <div>
    <app-form-item prop="fullName">
      <app-input
        v-model="form.fullName"
        placeholder="placeholder.input.input_full_name_of_receiver"
        label="form.label.recipient_full_name"/>
    </app-form-item>
    <app-form-item prop="account">
      <app-input
        v-model="form.account"
        placeholder="placeholder.input.input_account_number_of_receiver"
        label="form.label.recipient_account"/>
    </app-form-item>
    <app-form-item prop="iban">
      <app-input
        v-model="form.iban"
        placeholder="placeholder.input.input_iban"
        label="form.label.iban"/>
    </app-form-item>
    <app-form-item prop="bic">
      <app-input
        v-model="form.bic"
        placeholder="placeholder.input.input_bic"
        label="form.label.bic"/>
    </app-form-item>
    <app-form-item prop="swift">
      <app-input
        v-model="form.swift"
        placeholder="placeholder.input.input_swift"
        label="form.label.swift"/>
    </app-form-item>
    <app-form-item prop="name">
      <app-input
        v-model="form.name"
        placeholder="placeholder.input.input_bank_name"
        label="form.label.bank_name"/>
    </app-form-item>

    <app-form-item prop="address">
      <app-input
        v-model="form.address"
        placeholder="placeholder.input.input_bank_address"
        label="form.label.bank_address"/>
    </app-form-item>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue,
} from 'vue-property-decorator';
import { IPlainObject } from '@/types/interfaces';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';

@Component({
  components: {
    AppFormItem,
    AppInput,
  },
})
export default class BankForm extends Vue {

  @Prop({ type: Object, default: () => ({}) }) readonly value!: IPlainObject;

  protected get form() {
    return this.value;
  }

  protected set form(data: IPlainObject) {
    this.updateModel(data);
  }

  @Emit('input')
  protected updateModel(data: IPlainObject): IPlainObject {
    return data;
  }

}
</script>
