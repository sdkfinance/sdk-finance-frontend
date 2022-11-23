<template>
  <label
    class="app-switch"
    :class="classes">
    <span
      v-if="isShowLabelBefore"
      class="app-switch__label app-switch__label--before"
      :class="labelClassList">
      {{ calculatedLabel }}
      <slot name="afterLabel"/>
    </span>
    <el-switch
      :value="value"
      @change="$emit('change', $event)"/>
    <span
      v-if="isShowLabelAfter"
      class="app-switch__label app-switch__label--after"
      :class="labelClassList">
      {{ calculatedLabel }}
    </span>
  </label>
</template>

<script lang="ts">
import { Switch } from 'element-ui';
import {
  Component, Model, Prop, Vue,
} from 'vue-property-decorator';

import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    [Switch.name]: Switch,
  },
})
export default class AppSwitch extends Vue {

    @Model('change', { type: Boolean }) readonly value!: boolean

    @Prop({ type: String, default: '' }) readonly label!: string;

    @Prop({ type: String, default: '' }) readonly enableLabel!: string;

    @Prop({ type: String, default: '' }) readonly disableLabel!: string;

    @Prop({ type: Boolean, default: false }) readonly isDynamicLabelColor!: boolean;

    @Prop({ type: Boolean, default: false }) readonly isLabelAfter!: boolean;

    @Prop({ type: Boolean, default: false }) readonly fullWidth!: boolean;

    @Prop({ type: Boolean, default: false }) readonly secondary!: boolean;

    protected get isShowLabelBefore(): boolean {
      return (!!this.label || this.isDynamicLabel) && !this.isLabelAfter;
    }

    protected get isShowLabelAfter(): boolean {
      return (!!this.label || this.isDynamicLabel) && this.isLabelAfter;
    }

    protected get isDynamicLabel(): boolean {
      return Boolean(this.enableLabel) && Boolean(this.disableLabel);
    }

    protected get labelClassList(): IPlainObject {
      return {
        'app-switch__label--active': this.isDynamicLabelColor && this.value,
        'app-switch__label--inactive': this.isDynamicLabelColor && !this.value,
      };
    }

    protected get calculatedLabel(): string {
      if (this.isDynamicLabel) {
        return this.value ? this.$t(this.enableLabel) as string : this.$t(this.disableLabel) as string;
      }

      return this.$t(this.label) as string;
    }

    protected get classes(): IPlainObject[] {
      return [
        { 'app-switch--full-width': this.fullWidth },
        { 'app-switch--secondary': this.secondary },
      ];
    }

}
</script>

<style lang="scss">
.app-switch {
  display: inline-flex;
  align-items: center;

  &--full-width {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 22px;

    &--before {
      margin-right: 8px;
    }

    &--after {
      margin-left: 8px;
    }
  }

  .el-switch__core {
    background-color: $input-color;
    border: none;

    &::after {
      top: 2px;
      left: 2px;
      background-color: $placeholder-color;
    }
  }

  .el-switch.is-checked .el-switch__core {
    background-color: $input-color;

    &::after {
      margin-left: -16px;
      background-color: $primary-color;
    }
  }

  &--secondary {
    .el-switch__core {
      background-color: $blue-500;
      border: none;
      width: 32px !important;
      border-radius: 13px;
      height: 20px;

      &::after {
        top: 3px;
        left: 3px;
        width: 14px;
        height: 14px;
        background-color: #fff;
      }
    }

    .el-switch.is-checked .el-switch__core {
      background-color: $primary-color;

      &::after {
        margin-left: -17px;
        background-color: #fff;
      }
    }

    .app-switch__label {
      font-size: 14px;
      color: $blue-500;
      transition: color ease-in-out 0.2s;

      &--active {
        color: #000;
      }
    }
  }
}
</style>
