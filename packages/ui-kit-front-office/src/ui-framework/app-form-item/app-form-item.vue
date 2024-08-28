<template>
  <div class="app-form-item__wrapper">
    <el-form-item
      class="app-form-item"
      :prop="prop"
      :rules="rules"
      :error="parentState?.errors[prop]"
      :class="{ 'is-large': isLarge }">
      <slot />
    </el-form-item>
    <div
      v-if="$slots.action"
      class="app-form-item__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script lang="ts">
import { serverFormErrors } from '@sdk5/shared/constants';
import { FormItem } from 'element-ui';
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'AppFormItem',
  components: {
    [FormItem.name]: FormItem,
  },
  props: {
    prop: { type: String, required: true },
    isLarge: { type: Boolean, default: true },
    rules: { type: Object, default: null },
  },
  setup() {
    const parentState = inject(serverFormErrors);
    return {
      parentState,
    };
  },
});
</script>

<style lang="scss">
.app-form-item {
  &__wrapper {
    &:has(.app-form-item__action) {
      .app-form-item.el-form-item {
        @apply mb-[1rem];
      }
    }
  }

  &__action {
    .app-button.btn {
      @apply w-fit;
    }
  }
}

.el-form-item {
  @apply mb-[2rem];

  .is-large {
    @apply mb-30;
  }

  &.is-required .app-input__label::after,
  &.is-required .app-custom-select__label::after {
    content: '*';

    @apply m-0 ml-4 text-primary self-start;
  }

  &__error {
    @apply text-left border-red-main text-red-main mt-4;
  }
}
</style>
