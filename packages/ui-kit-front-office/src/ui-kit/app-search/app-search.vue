<template>
  <div class="app-search">
    <transition name="slide-fade">
      <app-input
        v-if="isSearchFocus"
        ref="appSearch"
        v-model="search"
        size="small"
        class="app-search__input inline"
        placeholder="placeholder.input.start_typing"
        @blur="$emit('blur')" />
    </transition>

    <i
      :class="!isSearchFocus ? 'icon-search app-search__icon-magnifier' : 'el-icon-close app-search__icon-close'"
      @click="toggleSearch" />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { TInputValue } from '../../ui-framework/app-input';
import { AppInput } from '../../ui-framework/app-input';

export default defineComponent({
  name: 'AppSearch',
  components: { AppInput },
  props: {
    value: {
      type: [String, Number] as PropType<TInputValue>,
      default: '',
    },
  },
  data() {
    const isSearchFocus: boolean = false;

    return {
      isSearchFocus,
    };
  },
  computed: {
    search: {
      get(): TInputValue {
        return this.value ?? '';
      },
      set(value: TInputValue) {
        this.updateValue(value);
      },
    },
    searchInput: {
      cache: false,
      get() {
        return this.$refs.appSearch as unknown as typeof AppInput;
      },
      set() {},
    },
  },
  methods: {
    async toggleSearch(): Promise<void> {
      this.isSearchFocus = !this.isSearchFocus;

      if (this.isSearchFocus) {
        await this.$nextTick();
        this.searchInput.focus();
      } else {
        this.onClear();
      }
    },
    updateValue(value: TInputValue) {
      this.$emit('input', value);
    },
    onBlur() {
      this.$emit('blur', true);
    },
    onClear() {
      this.search = '';
      this.$emit('clear', true);
    },
  },
});
</script>

<style lang="scss">
.app-search {
  @apply flex items-center;

  &__input {
    @apply origin-right;

    .el-input__inner {
      @apply px-0 rounded-none border-l-0 border-r-0 border-t-0 border-primary #{!important};
    }
  }

  i {
    @apply text-blue-600 cursor-pointer ml-10;
  }

  &__icon-magnifier {
    @apply text-sm leading-none;
  }

  &__icon-close {
    @apply text-xl;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  @apply transition duration-200 ease-linear;
}

.slide-fade-enter,
.slide-fade-leave-to {
  @apply transform scale-x-0 opacity-0;
}
</style>
