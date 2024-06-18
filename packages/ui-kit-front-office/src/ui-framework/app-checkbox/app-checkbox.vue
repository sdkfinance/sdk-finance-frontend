<template>
  <div :class="appCheckboxClassNames">
    <el-checkbox
      v-model="modelValue"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      :label="label"
      :true-label="trueLabel"
      :false-label="falseLabel"
      :border="false"
      :indeterminate="indeterminate">
      <template #default>
        <slot />
      </template>
    </el-checkbox>
  </div>
</template>

<script lang="ts">
import classNames from 'classnames';
import { Checkbox } from 'element-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppCheckbox',
  components: {
    'el-checkbox': Checkbox,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: '',
    },
    trueLabel: {
      type: String,
      default: '',
    },
    falseLabel: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Boolean],
      default: undefined,
    },
    filterView: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    modelValue: {
      get() {
        return this.value;
      },
      set(value: string | number | boolean) {
        this.emitChangeEvent(value);
      },
    },
    appCheckboxClassNames() {
      return classNames('app-checkbox', {
        'app-checkbox--filter-view': this.filterView,
      });
    },
  },
  methods: {
    emitChangeEvent(value: string | number | boolean) {
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/checkbox';
</style>
