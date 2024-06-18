<template>
  <el-form
    ref="form"
    v-loading="loading"
    :model="model"
    :rules="mappedRules"
    :validate-on-rule-change="validateOnRuleChange"
    @validate="resetServerErrors">
    <slot />
  </el-form>
</template>

<script lang="ts">
import { serverFormErrors } from '@sdk5/shared/constants';
import type { TServerError } from '@sdk5/shared/types';
import { clearValidate, getDeepKeys, validateForm, validateFormField } from '@sdk5/shared/utils';
import { Form } from 'element-ui';
import type { PropType } from 'vue';
import Vue, { defineComponent, provide } from 'vue';

type IPlainObject = Record<string, any>;
const state: IPlainObject = Vue.observable({ errors: {} });

export default defineComponent({
  name: 'AppForm',
  components: {
    [Form.name]: Form,
  },
  props: {
    model: { type: Object as PropType<IPlainObject>, required: true },
    rules: { type: Object as PropType<IPlainObject>, default: () => ({}) },
    loading: { type: Boolean, default: false },
    validateOnRuleChange: { type: Boolean, default: false },
    serverErrors: { type: Array as PropType<any[]>, default: () => [] },
  },
  setup() {
    provide(serverFormErrors, state);
  },
  data() {
    const mappedRules: IPlainObject = {};

    return {
      mappedRules,
      STATE: state,
    };
  },
  computed: {
    appForm: {
      cache: false,
      get() {
        return this.$refs.form as Form;
      },
      set() {},
    },
  },
  watch: {
    serverErrors: [{ deep: true, immediate: true, handler: 'setServerErrors' }],
    '$i18n.locale': [
      {
        handler: 'changeLocale',
      },
    ],
    model: [{ immediate: true, deep: true, handler: 'updateRules' }],
    rules: [{ immediate: true, deep: true, handler: 'updateRules' }],
  },
  methods: {
    resetServerErrors(prop: string): void {
      if (prop in state.errors) {
        delete state.errors[prop];
      }
    },
    async validate(): Promise<boolean> {
      this.clearValidate();
      return validateForm.call(this);
    },
    async validateField(fields: string | string[]): Promise<boolean> {
      return validateFormField.call(this, fields);
    },
    clearValidate(fields: string | string[] = ''): void {
      let fieldsList = fields;

      if (!fields) {
        fieldsList = getDeepKeys(this.model) || {};
      }

      return clearValidate.call(this, fieldsList);
    },
    async resetFields(): Promise<void> {
      await this.appForm.resetFields();
      await this.$nextTick();
      this.clearValidate();
    },
    setServerErrors(newErrors: TServerError[]) {
      if (!newErrors) {
        return;
      }

      state.errors = newErrors.reduce((acc: IPlainObject, { parameter, message }) => ({ ...acc, [parameter]: message }), {});
    },
    changeLocale(): void {
      this.clearValidate();
    },
    updateRules(): void {
      // Need to optimize it.

      const getRule = (name: string, arrayIndex: number | null = null) => {
        const field = this.model[name];

        if (typeof this.rules?.[name] === 'function') {
          const data = Array.isArray(field) && arrayIndex !== null ? field[arrayIndex] : field;
          return this.rules[name](data);
        }

        return this.rules?.[name] || null;
      };

      const getRulesForArray = (name: string) =>
        this.model[name].reduce(
          (acc: IPlainObject, item: IPlainObject, index: number): IPlainObject => ({
            ...acc,
            [index]: getRule(name, index),
          }),
          {},
        );

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
    },
  },
});
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
