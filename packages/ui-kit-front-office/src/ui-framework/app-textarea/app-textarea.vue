<template>
  <app-input
    ref="appInputRef"
    v-model="valueModel"
    :size="appInputSizeProp"
    :rows="appInputRowsProp"
    :type="APP_INPUT_TYPE.textarea"
    :disabled="disabled"
    :placeholder="placeholder"
    :resize="resize"
    :autosize="autosize"
    :label="label" />
</template>

<script lang="ts">
import { APP_COMPONENTS_SIZE } from '@sdk5/shared/constants';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { TAppInputResizeProp, TAppInputSize } from '../app-input';
import { APP_INPUT_TYPE, AppInput } from '../app-input';
import { APP_TEXTAREA_SIZES } from './constants';
import type { TAppTextareaSize } from './types';

const sizeValidator = (value: unknown): boolean => APP_TEXTAREA_SIZES.includes(value as TAppTextareaSize);

export default defineComponent({
  name: 'AppTextarea',
  components: { AppInput },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    value: { type: String, default: '' },
    rows: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
    size: {
      type: String as PropType<TAppTextareaSize>,
      default: APP_COMPONENTS_SIZE.medium,
      validator: sizeValidator,
    },
    resize: { type: String as PropType<TAppInputResizeProp>, default: undefined },
    autosize: { type: Boolean, default: false },
  },
  data() {
    return {
      APP_INPUT_TYPE,
    };
  },
  computed: {
    appInputSizeProp(): TAppInputSize {
      switch (this.size) {
        case APP_COMPONENTS_SIZE.large:
          return APP_COMPONENTS_SIZE.large;

        case APP_COMPONENTS_SIZE.medium:
          return APP_COMPONENTS_SIZE.medium;

        case APP_COMPONENTS_SIZE.small:
        case APP_COMPONENTS_SIZE.ultraSmall:
          return APP_COMPONENTS_SIZE.small;

        default:
          return APP_COMPONENTS_SIZE.medium;
      }
    },
    appInputRowsProp(): number {
      if (typeof this.rows !== 'undefined') {
        return this.rows;
      }

      switch (this.size) {
        case APP_COMPONENTS_SIZE.large:
          return 3;
        case APP_COMPONENTS_SIZE.medium:
        case APP_COMPONENTS_SIZE.small:
          return 2;
        case APP_COMPONENTS_SIZE.ultraSmall:
        default:
          return 1;
      }
    },
    valueModel: {
      get() {
        return this.value;
      },
      set(value: string) {
        this.emitChangeEvent(value);
      },
    },
    appInput: {
      cache: false,
      get() {
        return this.$refs.appInputRef as unknown as typeof AppInput;
      },
      set() {},
    },
  },
  watch: {
    appInputRowsProp: [
      {
        handler: 'appInputRowsPropChangeHandler',
      },
    ],
  },
  methods: {
    appInputRowsPropChangeHandler() {
      this.$nextTick(this.appInput.resizeTextarea);
    },
    emitChangeEvent(value: string) {
      this.$emit('change', value);
    },
  },
});
</script>
