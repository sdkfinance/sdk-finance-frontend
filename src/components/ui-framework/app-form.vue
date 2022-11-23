<template>
  <el-form
    ref="form"
    v-loading="loading"
    :model="model"
    :rules="mappedRules"
    :validate-on-rule-change="validateOnRuleChange"
    @validate="resetServerErrors">
    <slot/>
  </el-form>
</template>

<script lang="ts">
import { Form } from 'element-ui';
import {
  Component, Prop, Provide,
  Ref, Vue, Watch,
} from 'vue-property-decorator';

import { serverFormErrors } from '@/constants/symbols';
import { IPlainObject } from '@/types/interfaces';
import { TServerError } from '@/types/interfaces/ServerError.interface';
import {
  clearValidate, getDeepKeys,
  validateForm, validateFormField,
} from '@/utils';

const state: IPlainObject = Vue.observable({ errors: {} });

@Component({
  components: {
    [Form.name]: Form,
  },
})
export default class AppForm extends Vue {

  @Ref('form') readonly appForm!: AppForm

  @Prop({ type: Object, required: true }) readonly model!: IPlainObject;

  @Prop({ type: Object, default: () => ({}) }) readonly rules!: IPlainObject;

  @Prop({ type: Boolean, default: false }) readonly loading!: boolean;

  @Prop({ type: Boolean, default: false }) readonly validateOnRuleChange!: boolean;

  @Prop({ type: Array, default: () => ([]) }) readonly serverErrors!: [];

  @Provide(serverFormErrors) STATE: IPlainObject = state;

  protected mappedRules: IPlainObject = {};

  @Watch('serverErrors', { deep: true, immediate: true })
  protected setServerErrors(newErrors: TServerError[]) {
    if (!newErrors) return;

    state.errors = newErrors.reduce((acc: IPlainObject, { parameter, message }) => (
      { ...acc, [parameter]: message }), {});
  }

  @Watch('$i18n.locale')
  protected changeLocale(): void {
    this.clearValidate();
  }

  @Watch('model', { immediate: true, deep: true })
  @Watch('rules', { immediate: true, deep: true })
  protected updateRules(): void {
    // Need to optimize it.

    const getRule = (name: string, arrayIndex: number | null = null) => {
      const field = this.model[name];

      if (typeof this.rules?.[name] === 'function') {
        const data = Array.isArray(field) && arrayIndex !== null ? field[arrayIndex] : field;
        return this.rules[name](data);
      }
      return this.rules?.[name] || null;
    };

    const getRulesForArray = (name: string) => this.model[name].reduce((acc: IPlainObject, item: IPlainObject, index: number): IPlainObject => ({
      ...acc,
      [index]: getRule(name, index),
    }), {});

    const setRules = (name: string) => {
      const field = this.model[name];
      const rule = this.rules[name];

      const ruleIsArray = Array.isArray(rule);
      const isNestedRule = (typeof rule === 'object' || typeof rule === 'function') && !ruleIsArray;

      if (isNestedRule && Array.isArray(field)) {
        return getRulesForArray(name);
      }

      if (typeof rule === 'object') {
        return rule;
      }

      return getRule(name);
    };

    this.mappedRules = Object.keys(this.rules).reduce((acc: IPlainObject, name: string) => ({ ...acc, [name]: setRules(name) }), {});
  }

  protected resetServerErrors(prop: string): void {
    if (prop in state.errors) {
      delete state.errors[prop];
    }
  }

  public async validate(): Promise<boolean> {
    this.clearValidate();
    return validateForm.call(this);
  }

  public async validateField(fields: string | string[]): Promise<boolean> {
    return validateFormField.call(this, fields);
  }

  public clearValidate(fields: string | string[] = ''): void {
    let fieldsList = fields;
    if (!fields) {
      fieldsList = getDeepKeys(this.model) || {};
    }
    return clearValidate.call(this, fieldsList);
  }

  public async resetFields(): Promise<void> {
    await this.appForm.resetFields();
    await this.$nextTick();
    this.clearValidate();
  }

}
</script>

<style lang="scss">
  .form {
    max-width: 330px;

    &__list {
      font-size: 12px;
      margin-bottom: 16px;

      p {
        line-height: 1.6;
      }
    }
  }
</style>
