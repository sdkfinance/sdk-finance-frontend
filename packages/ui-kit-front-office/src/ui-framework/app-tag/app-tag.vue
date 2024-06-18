<template>
  <el-tag
    :class="appTagClassname"
    size="small"
    disable-transitions
    closable
    @click="emitClick"
    @close="emitDelete">
    <span
      v-if="label"
      class="app-tag__label"
      >{{ $t(label) }}:</span
    >
    <span class="app-tag__value">
      <slot />
    </span>
  </el-tag>
</template>

<script lang="ts">
import { Tag } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { TAppTagType } from './types';

export default defineComponent({
  name: 'AppTag',
  components: {
    'el-tag': Tag,
  },
  props: {
    tagType: {
      type: String as PropType<TAppTagType>,
      default: 'tag' as TAppTagType,
    },
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    appTagClassname() {
      return ['app-tag', `app-tag--${this.tagType}`];
    },
  },
  methods: {
    emitDelete() {
      this.$emit('delete');
    },
    emitClick() {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss">
.app-tag {
  &--tag {
    @apply bg-gray-150 rounded-[0.1875rem] h-[2.1875rem] leading-[2.1875rem] border-none py-0 px-[14px] text-sm font-medium;

    .app-tag {
      &__label {
        @apply text-[#8ea1ba];
      }

      &__value {
        @apply text-black font-semibold;
      }
    }

    .el-tag__close {
      @apply text-black text-md leading-none;
    }
  }

  &--chips {
    @apply inline-flex
    items-center
    gap-x-[0.125rem]
    rounded-[0.25rem]
    bg-gray-100
    border
    border-solid
    border-blue-300
    py-[0.3125rem]
    px-[0.5rem]
    h-auto;

    .app-tag {
      &__label,
      &__value {
        @apply text-sm leading-[1.125rem] font-medium;
      }

      &__label {
        @apply text-gray-400;
      }

      &__value {
        @apply text-gray-500;
      }
    }

    &.el-tag {
      .el-tag__close.el-icon-close {
        @apply scale-100
        leading-none
        flex
        items-center
        justify-center
        w-[1rem]
        h-[1rem]
        text-[0.9375rem]
        text-blue-600
        top-0
        right-0
        hover:text-blue-700
        hover:bg-transparent;

        &::before {
          @apply flex;
        }
      }
    }
  }
}
</style>
