<template>
  <component
    :is="tag"
    :to="to"
    class="app-list-link">
    <div class="app-list-link__icon">
      <img
        v-if="iconPath"
        :src="iconPath"
        :alt="titleString" />
      <span
        v-else
        :class="icon" />
    </div>
    <div class="app-list-link__title">
      {{ titleString }}
    </div>
    <div class="app-list-link__arrow icon-chevron-right" />
  </component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { RawLocation } from 'vue-router';

export default defineComponent({
  name: 'AppListLink',
  props: {
    to: { type: [Object, String] as PropType<RawLocation>, required: true },
    icon: { type: String, default: undefined },
    iconPath: { type: String, default: undefined },
    title: { type: String, required: true },
    tag: { type: String, default: 'router-link' },
  },
  computed: {
    titleString(): string {
      return this.$t(this.title).toString();
    },
  },
});
</script>

<style lang="scss" scoped>
.app-list-link {
  @apply rounded-[8px] bg-white px-24 py-20 flex items-center gap-x-[1.5rem] mb-16 shadow-[0_2px_12px_0_rgba(161,182,198,0.20)];

  &__icon {
    @apply bg-blue-200 rounded-full flex justify-center items-center w-40 h-40 text-11 leading-[normal] text-blue-600;
  }

  &__title {
    @apply text-gray-500 text-lg font-semibold;
  }

  &__arrow {
    @apply ml-auto text-blue-600 text-xs;
  }
}
</style>
