<template>
  <div class="app-dropdown">
    <el-dropdown
      :trigger="trigger"
      @visible-change="onVisibleChange"
      @command="updateValue">
      <slot
        name="trigger"
        class="app-dropdown__label"
        v-bind="{ isDropDownVisible }">
        <span
          class="el-dropdown-link"
          :class="titleClasses">
          <slot/>
          {{ $t(label) }}
          <i
            class="app-dropdown__arrow icon-arrow-down-curv transition transform"
            :class="{'rotate-180': isDropDownVisible}"/>
        </span>
      </slot>
      <el-dropdown-menu
        slot="dropdown"
        :style="{'min-width': minWidth}"
        :class="{'app-dropdown--secondary': secondary}">
        <el-dropdown-item
          v-for="(option, i) in options"
          :key="`dropdown_${i}`"
          :class="[{'is-selected': value === getOption(option)}, option.classes]"
          :icon="option.icon"
          :command="option.command || option">
          {{ getLabel(option) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import { IOption } from '@/types/interfaces/Options.interface';
import { getProp } from '@/utils';

type TOption = string | { [key: string]: any };
type TLabelFunction = (label: TOption) => string;

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
})
export default class AppDropdown extends Vue {

  @Prop() readonly value!: any;

  @Prop({ default: '', type: String }) readonly label!: string;

  @Prop({ default: '', type: String }) readonly titleClasses!: string;

  @Prop({ default: 'click', type: String }) readonly trigger!: string;

  @Prop({ default: () => ([]), type: Array }) readonly options!: IOption[];

  @Prop({ default: '', type: String }) readonly optionValue!: string;

  @Prop({ default: false, type: Boolean }) readonly secondary!: string;

  @Prop({ default: '', type: String, validator: (value: string) => (value ? value.indexOf('px') !== -1 : true) }) readonly minWidth!: string;

  @Prop({
    default: '',
    type: [String, Function],
  }) readonly optionLabel!: string | TLabelFunction;

  protected isDropDownVisible: boolean = false;

  @Emit('input')
  @Emit('click')
  protected updateValue(value: any): any {
    return this.getOption(value);
  }

  protected getOption(value: any): any {
    return this.optionValue ? getProp(value, this.optionValue) : value;
  }

  protected getLabel(option: TOption): TOption {
    if (!this.optionLabel || typeof option !== 'object') {
      return option;
    }

    if (typeof this.optionLabel === 'function') {
      return this.optionLabel(option);
    }

    return this.$t(getProp(option, this.optionLabel));
  }

  protected onVisibleChange(visible: boolean): void {
    this.isDropDownVisible = visible;
  }

}
</script>

<style lang="scss">
.app-dropdown {
  &__label {
    @apply text-blue-600;
  }

  &__arrow {
    @apply text-inherit ml-4 text-0.4em;
  }

  &--secondary {
    @apply mt-4 #{!important};
    @apply py-8 px-0 #{!important};

    .popper__arrow {
      @apply hidden #{!important};
    }
  }
}

.el-dropdown-link {
  @apply cursor-pointer flex items-center;
}

.el-dropdown-menu__item {
  i {
    @apply text-xs;
  }

  &.is-selected {
    @apply text-base bg-blue-300;
  }
}
</style>
