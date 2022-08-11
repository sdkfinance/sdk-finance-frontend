<template>
  <component
    :is="to ? 'router-link': 'el-button'"
    :class="buttonClasses"
    :size="size"
    :to="to"
    :type="type"
    :native-type="nativeType"
    :loading="isLoading"
    :disabled="disabled"
    v-on="$listeners">
    <i
      v-if="icon && !iconRight"
      :class="iconClasses"/>
    <slot v-if="!onlyIcon"/>
    <i
      v-if="icon && iconRight"
      :class="iconClasses"/>
  </component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Button } from 'element-ui';

const BUTTON_SIZES = [
  'large',
  'big',
  'medium',
  'small',
  'mini',
  '',
];

const BUTTON_TYPES = {
  primary: 'primary',
  warning: 'warning',
  secondary: 'secondary',
};

const sizeValidator = (size: string): boolean => BUTTON_SIZES.includes(size);

@Component({
  components: {
    [Button.name]: Button,
  },
})
export default class AppButton extends Vue {

  @Prop({ default: 'big', type: String, validator: sizeValidator }) readonly size!: string;

  @Prop({ default: false, type: Boolean }) readonly fullWidth!: boolean;

  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isLink!: boolean;

  @Prop({ default: 'submit', type: String }) readonly nativeType!: boolean;

  @Prop({ default: 'secondary', type: String }) readonly type!: string;

  @Prop({ default: null, type: [Object, String] }) readonly to!: object | string | null;

  @Prop({ default: null, type: Boolean }) readonly secondary!: boolean | null;

  @Prop({ default: false, type: Boolean }) readonly outlined!: boolean;

  @Prop({ default: '', type: String }) readonly icon!: string;

  @Prop({ default: false, type: Boolean }) readonly iconRight!: boolean;

  @Prop({ default: false, type: Boolean }) readonly transparent!: boolean;

  @Prop({ default: false, type: Boolean }) readonly onlyIcon!: boolean;

  protected get buttonClasses(): string[] {
    return [
      'btn',
      this.sizeClass,
      this.fullWidthClass,
      this.linkClass,
      this.secondaryClass,
      this.transparentClass,
      this.outlinedClass,
      this.typeCLass,
    ];
  }

  protected get typeCLass(): string {
    if (this.type === BUTTON_TYPES.primary) {
      return 'btn--primary';
    }

    if (this.type === BUTTON_TYPES.warning) {
      return 'btn--warning';
    }

    if (this.type === BUTTON_TYPES.secondary) {
      return 'btn--secondary';
    }

    return '';
  }

  protected get iconClasses(): string[] {
    return ['btn-icon icon', this.icon, this.iconRight ? 'btn-icon--right' : 'btn-icon--left'];
  }

  protected get sizeClass(): string {
    return this.size ? `btn--${this.size}` : '';
  }

  protected get fullWidthClass(): string {
    return this.fullWidth ? 'btn--full-width' : '';
  }

  protected get linkClass(): string {
    return this.to ? 'btn--link' : '';
  }

  protected get secondaryClass(): string {
    return this.secondary ? 'btn--secondary' : '';
  }

  protected get transparentClass(): string {
    return this.transparent ? 'btn--transparent' : '';
  }

  protected get outlinedClass(): string {
    return this.outlined ? 'btn--outlined' : '';
  }

}
</script>

<style lang="scss">
.btn {
  height: fit-content;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  line-height: 20px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  text-align: center;
  font-weight: 600;
  border: none;
  background-color: #f0f7fd;
  color: #7288a3;

  &:hover {
    background-color: #e5f1fb;
    color: #7288a3;
  }

  &:disabled {
    background-color: $btn-bg-disabled;
    color: $btn-text-disabled;
    cursor: default;
    border-color: transparent;

    &:hover {
      border-color: transparent;
      background-color: $btn-bg-disabled;
      color: $btn-text-disabled;
    }
  }

  &--primary {
    background-color: #1b55e9;
    color: #fff;

    &:hover {
      background-color: #1449d0;
      color: #fff;
    }
  }

  &--warning {
    background-color: #ff4550;
    color: #fff;

    &:hover {
      background-color: #ff4550;
      color: #fff;
    }
  }

  &--link {
    white-space: nowrap;
  }

  &--large {
    padding: 9px 16px;
    font-size: 16px;
    border-radius: 8px;
  }

  &--big {
    padding: 9px 16px;
    font-size: 16px;
    border-radius: 8px;
  }

  &--medium {
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 6px;
  }

  &--small {
    padding: 6px 8px;
    font-size: 12px;
    line-height: 16px;
    border-radius: 4px;
  }

  &--mini {
    padding: 4px 16px;
    font-size: 12px;
    line-height: 16px;
    min-width: initial;
    border-radius: 4px;
  }

  &--full-width {
    width: 100%;
  }

  &.is-disabled:hover {
    background-color: $btn-bg-disabled;
    color: $btn-text-disabled;
  }

  &--secondary {
    background-color: #f0f7fd;
    color: #7288a3;
    border: none;

    &:hover {
      background-color: #e5f1fb;
      color: #7288a3;
    }
  }

  &--transparent {
    background-color: transparent;
    color: #7288a3;
    padding: 5px;
    border-color: transparent;
  }

  &--transparent:hover,
  &--transparent:active,
  &--transparent:focus {
    background-color: transparent;
    color: #4c617f;
    border-color: transparent;
  }

  &.is-disabled .btn--secondary {
    border: 2px solid #f5f5f5;
    background: #fff;
  }

  &.is-disabled .btn--secondary:hover {
    border: 2px solid #f5f5f5;
  }

  &--outlined {
    background-color: #fff;
    color: #7288a3;
    border: solid 2px #d3e1ec;
    padding-top: 7px;
    padding-bottom: 7px;

    &:hover {
      border-color: #a1b6c6;
      background-color: #fff;
      color: #7288a3;
    }

    &.btn--warning {
      border: solid 2px #ff4550;
      color: #ff4550;
    }

    &.is-disabled {
      border-color: #f5f5f5;
      color: #b4b6b8;
      background-color: #fff;

      &:hover {
        border-color: #f5f5f5 !important;
        color: #b4b6b8 !important;
        background-color: #fff !important;
      }
    }
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 16px;
    width: 16px;
    font-size: 8px;

    &--left {
      margin-right: 5px;
    }

    &--right {
      margin-left: 5px;
    }
  }
}

</style>
