<template>
  <div class="app-checkbox-group">
    <el-checkbox-group
      v-model="modelValue"
      :disabled="disabled">
      <slot />
    </el-checkbox-group>
  </div>
</template>

<script lang="ts">
import { CheckboxGroup } from 'element-ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppCheckboxGroup',
  components: {
    'el-checkbox-group': CheckboxGroup,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    modelValue: {
      get() {
        return this.value;
      },
      set(value: (string | number | boolean)[]) {
        this.emitChangeEvent(value);
      },
    },
  },
  methods: {
    emitChangeEvent(value: (string | number | boolean)[]) {
      this.$emit('change', value);
    },
  },
});
</script>
