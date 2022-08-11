<template>
  <el-tooltip
    class="app-tooltip"
    :effect="effect"
    popper-class="app-tooltip"
    :content="content"
    :disabled="disabled"
    :placement="placement">
    <template #content>
      <slot name="content"/>
    </template>
    <slot/>
  </el-tooltip>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import { Tooltip } from 'element-ui';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
  },
})
export default class AppTooltip extends Vue {

  @Prop({ default: 'dark', type: String }) readonly effect!: 'dark' | 'light';

  @Prop({ default: '', type: String }) readonly content!: string;

  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;

  @Prop({
    default: 'top',
    type: String,
    validator(value: any): boolean {
      return [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ].includes(value);
    },
  }) readonly placement!: string;

}
</script>

<style lang="scss">
.app-tooltip {
  @apply flex;

  &.el-tooltip__popper {
    @apply text-sm;

    &.is-dark {
      @apply max-w-220 bg-blue-600 p-8;

      .popper__arrow::after {
        @apply border-t-blue-600;
      }
    }
  }
}

</style>
