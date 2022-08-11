<template>
  <el-popover
    :placement="placement"
    :width="width"
    :popper-class="popoverClass"
    :trigger="trigger">
    <template #reference>
      <slot name="action"/>
    </template>
    <slot/>
  </el-popover>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import { Popover } from 'element-ui';

@Component({
  components: {
    [Popover.name]: Popover,
  },
})
export default class AppPopover extends Vue {

  @Prop({ default: 300, type: Number }) readonly width!: number;

  @Prop({ default: '', type: String }) readonly popoverClass!: string;

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

  @Prop({
    default: 'hover',
    type: String,
    validator(value: any): boolean {
      return ['click', 'focus', 'hover', 'manual'].includes(value);
    },
  }) readonly trigger!: string;

}
</script>
