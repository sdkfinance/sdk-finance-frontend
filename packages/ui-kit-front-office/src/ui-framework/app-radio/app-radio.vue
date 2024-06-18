<template>
  <el-radio-group
    v-model="radioGroup"
    class="app-radio-group">
    <slot>
      <app-radio-button
        v-for="option in options"
        :key="option.value"
        :label="option.value.toString()">
        {{ $t(option.label.toString()) }}
      </app-radio-button>
    </slot>
  </el-radio-group>
</template>

<script lang="ts">
import type { IOption } from '@sdk5/shared/types';
import { RadioGroup } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppRadioButton } from '../app-radio-button';

export default defineComponent({
  name: 'AppRadio',
  components: {
    AppRadioButton,
    [RadioGroup.name]: RadioGroup,
  },
  props: {
    value: { required: true, type: String },
    options: { default: () => [], type: Array as PropType<IOption[]> },
  },
  computed: {
    radioGroup: {
      get(): string | number {
        return this.value;
      },
      set(value: string | number) {
        this.updateValue(value);
      },
    },
  },
  methods: {
    updateValue(value: string | number) {
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss">
.app-radio-group {
  @apply w-full;

  span {
    margin: 5px 0 !important;
  }
}
</style>
