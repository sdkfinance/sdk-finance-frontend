<template>
  <div :class="appDropdownClassNames">
    <el-dropdown
      ref="dropdownRef"
      :trigger="trigger"
      :hide-on-click="hideOnClick"
      :placement="placement"
      @visible-change="onVisibleChange"
      @command="updateValue">
      <div
        class="app-dropdown__trigger"
        role="button">
        <slot
          name="trigger"
          class="app-dropdown__label"
          v-bind="{ isDropDownVisible }">
          <span
            class="el-dropdown-link"
            :class="titleClasses">
            <slot />
            {{ $t(label) }}
          </span>
          <i class="app-dropdown__arrow icon-arrow-down-curv" />
        </slot>
      </div>
      <template #dropdown>
        <el-dropdown-menu
          :style="{ 'min-width': minWidth }"
          :class="appDropdownMenuClassNames">
          <slot name="dropdownMenu">
            <template v-for="(option, i) in options">
              <app-dropdown-menu-item-container
                :key="`dropdown_${i}_${value}`"
                :value="value"
                :option="option"
                :option-value="getOption(option)">
                <template #option="{ isOptionSelected }">
                  <slot
                    name="option"
                    v-bind="{ option, isOptionSelected }">
                    {{ getLabel(option) }}
                  </slot>
                </template>
              </app-dropdown-menu-item-container>
            </template>
          </slot>
          <div
            v-if="$scopedSlots.afterOptions"
            class="app-dropdown__after-options">
            <slot
              name="afterOptions"
              v-bind="{ hideDropdown }" />
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import type { IOption } from '@sdk5/shared/types';
import { getProp } from '@sdk5/shared/utils';
import { Dropdown, DropdownMenu } from 'element-ui';
import { cloneDeep } from 'lodash';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import AppDropdownMenuItemContainer from './app-dropdown-menu-item-container.vue';
import type { TAppDropdownPlacement, TAppDropdownTrigger } from './types';

type TOption = string | { [key: string]: any };
type TLabelFunction = (label: TOption) => string;

export default defineComponent({
  name: 'AppDropdown',
  components: {
    AppDropdownMenuItemContainer,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
  },
  props: {
    value: {
      type: [Object, String, Number, Boolean, Array] as PropType<
        Record<string, any> | string | number | boolean | any[] | null | undefined | (object & {})
      >,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    titleClasses: {
      type: String,
      default: '',
    },
    trigger: {
      type: String as PropType<TAppDropdownTrigger>,
      default: 'click' as TAppDropdownTrigger,
    },
    options: {
      type: Array as PropType<IOption[]>,
      default: () => [],
    },
    optionValue: {
      type: String,
      default: '',
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    minWidth: {
      type: String,
      default: '',
      validator: (value: string) => (value ? value.indexOf('px') !== -1 : true),
    },
    optionLabel: {
      type: [String, Function] as PropType<string | TLabelFunction>,
      default: '',
    },
    placement: {
      type: String as PropType<TAppDropdownPlacement>,
      default: 'bottom-end' as TAppDropdownPlacement,
    },
    hideOnClick: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    filterView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDropDownVisible: false,
    };
  },
  computed: {
    dropdownRef: {
      cache: false,
      get() {
        return this.$refs.dropdownRef as Dropdown & {
          hide: () => void;
        };
      },
      set() {},
    },
    appDropdownClassNames() {
      return [
        'app-dropdown',
        this.secondary && 'app-dropdown--secondary',
        this.isDropDownVisible && 'app-dropdown--dropdown-visible',
        this.filterView && 'app-dropdown--filter-view',
        this.multiple && 'app-dropdown--multiple',
      ];
    },
    appDropdownMenuClassNames() {
      return [
        (this.secondary ?? this.filterView) && 'app-dropdown--secondary',
        this.filterView && 'app-dropdown--filter-view',
        this.multiple && 'app-dropdown--multiple',
      ];
    },
  },
  methods: {
    updateValue(value: any) {
      if (this.multiple) {
        const valueCopy = cloneDeep(Array.isArray(this.value) ? this.value : []);
        const existsIndex = valueCopy.findIndex((valueItem) => valueItem === this.getOption(value));

        if (existsIndex > -1) {
          valueCopy.splice(existsIndex, 1);
        } else {
          valueCopy.push(this.getOption(value));
        }

        this.$emit('input', valueCopy);
        this.$emit('click', valueCopy);
        return;
      }

      this.$emit('input', this.getOption(value));
      this.$emit('click', this.getOption(value));
    },
    getOption(value: any) {
      return this.optionValue ? getProp(value, this.optionValue) : value;
    },
    getLabel(option: TOption) {
      if (!this.optionLabel || typeof option !== 'object') {
        return option;
      }

      if (typeof this.optionLabel === 'function') {
        return this.optionLabel(option);
      }

      return this.$t(getProp(option, this.optionLabel));
    },
    onVisibleChange(visible: boolean) {
      this.isDropDownVisible = visible;
    },
    hideDropdown() {
      this.dropdownRef?.hide();
    },
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/parts/select_dropdown';

.el-dropdown-menu {
  &.app-dropdown--filter-view {
    @apply min-w-[7.5rem];

    &.app-dropdown--multiple {
      @apply min-w-[9.75rem];
    }
  }
}

.app-dropdown {
  &--dropdown-visible {
    .app-dropdown {
      &__arrow,
      &__trigger i {
        @apply rotate-180;
      }
    }
  }

  &__label {
    @apply text-blue-600;
  }

  &__arrow,
  &__trigger i {
    @apply text-inherit ml-4 text-0.4em transition transform;
  }

  &__trigger,
  &__trigger > div {
    @apply flex items-center gap-x-[0.25rem];
  }

  &__after-options {
    @apply w-full mt-[1rem];
  }

  &--secondary,
  &--filter-view {
    .app-dropdown {
      &__arrow,
      &__trigger i {
        @apply ml-0;
      }
    }
  }

  &--filter-view {
    .app-dropdown {
      &__arrow,
      &__trigger i {
        @apply w-[1rem] h-[1rem] inline-flex items-center justify-center leading-normal origin-center;
      }
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
