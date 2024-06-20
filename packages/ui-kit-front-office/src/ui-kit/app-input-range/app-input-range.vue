<template>
  <div class="input-range__container">
    <app-input label="table.label.amount">
      <div class="input-range el-input el-input--medium">
        <div class="input-range__inner el-input__inner">
          <input
            v-model.number="modelValue.min"
            type="number"
            :min="0"
            :placeholder="inputPlaceholders.from" />
          <span class="input-range__divider">—</span>
          <input
            v-model.number="modelValue.max"
            type="number"
            :min="0"
            :placeholder="inputPlaceholders.to" />
        </div>
      </div>
    </app-input>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppInput } from '../../ui-framework/app-input';
import type { TInputRangeProp } from './types';

export default defineComponent({
  name: 'AppInputRange',
  components: { AppInput },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Object as PropType<TInputRangeProp>,
      required: true,
    },
  },
  computed: {
    modelValue: {
      get() {
        return this.value;
      },
      set(value: TInputRangeProp) {
        this.$emit('change', value);
      },
    },
    inputPlaceholders() {
      return {
        from: this.$t('table.label.from').toString(),
        to: this.$t('table.label.to').toString(),
      };
    },
  },
});
</script>

<style lang="scss">
.input-range__container {
  .app-input {
    @apply flex flex-col;
  }

  .input-range {
    @apply relative w-[12.5rem];

    &__inner {
      @apply flex items-center gap-x-[0.5rem] focus-within:border-primary;
    }

    input {
      @apply first-of-type:w-[2.6875rem] w-full outline-none bg-transparent placeholder-blue-500 caret-primary font-medium text-gray-500;
    }
  }
}
</style>
