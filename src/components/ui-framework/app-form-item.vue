<template>
  <el-form-item
    class="app-form-item"
    :prop="prop"
    :error="parentState.errors[prop]"
    :class="{ 'is-large': isLarge }">
    <slot/>
  </el-form-item>
</template>

<script lang="ts">
import { FormItem } from 'element-ui';
import {
  Component, Inject,
  Prop, Vue,
} from 'vue-property-decorator';

import { serverFormErrors } from '@/constants/symbols';
import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    [FormItem.name]: FormItem,
  },
})
export default class AppFormItem extends Vue {

  @Prop({ type: String, required: true }) readonly prop!: string;

  @Prop({ type: Boolean, default: true }) readonly isLarge!: boolean;

  @Inject(serverFormErrors) parentState!: { errors: IPlainObject };

}
</script>

<style lang="scss">
.el-form-item {
  .is-large {
    @apply mb-30;
  }

  &.is-required .app-input__label::after,
  &.is-required .app-custom-select__label::after {
    content: "*";

    @apply m-0 ml-4 text-blue-accent self-start;
  }

  &__error {
    @apply text-left border-red-main text-red-main mt-4;
  }
}
</style>
