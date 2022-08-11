<template>
  <app-form
    v-if="isFormExist"
    ref="form"
    class="form"
    :rules="rules"
    :model="form"
    @submit.native.prevent="handleForm">
    <app-form-item
      v-for="field in fields"
      :key="field.name"
      :prop="field.name">
      <app-input
        v-model.trim="form[field.name]"
        placeholder="placeholder.input.input_field"
        :label="$t(field.label || field.name)"/>
    </app-form-item>

    <slot
      name="actions"
      v-bind="{ isValid, validate }"/>
  </app-form>
</template>

<script lang="ts">
import {
  Component, Prop, Watch, Ref, Vue,
} from 'vue-property-decorator';
import AppForm from '@/components/ui-framework/app-form.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import { IDynamicField, IPlainObject } from '@/types/interfaces';
import { IGatePayerField } from '@/services/requests/gate/Gate.types';

@Component({
  components: {
    AppForm,
    AppFormItem,
    AppInput,
  },
})
export default class DynamicForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Array, required: true }) readonly fields!: IDynamicField[];

  public isValid: boolean = false;

  protected form: IPlainObject = {};

  protected rules: IPlainObject = {};

  protected get isFormExist(): boolean {
    return !!Object.keys(this.form).length;
  }

  @Watch('fields', { immediate: true, deep: true })
  setForm(newFields: IDynamicField[]) {
    newFields.forEach((field: IDynamicField) => {
      this.$set(this.form, field.name, null);
      this.$set(this.rules, field.name, field.constraints.map((rule) => (
        {
          required: !field.optional,
          pattern: new RegExp(rule.regex, 'g'),
          message: rule.errorMessageKey,
          trigger: 'blur',
        }
      )));
    });
  }

  public async validate(): Promise<{ isValid: boolean; fields: IGatePayerField[] }> {
    this.isValid = await this.appForm.validate();
    const { isValid, form } = this;
    const fields = Object.keys(form).map((key: string) => ({ name: key, value: form[key] }));
    return { isValid, fields };
  }

}

</script>
