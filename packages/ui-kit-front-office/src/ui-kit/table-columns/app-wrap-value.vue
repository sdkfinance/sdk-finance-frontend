<template>
  <div class="app-wrap-value">
    <app-popover
      :width="undefined"
      popover-class="app-wrap-value__hint">
      <template #default>
        <button
          class="app-wrap-value__button icon icon-copy"
          @click="copyData" />
        <span>{{ value }}</span>
      </template>
      <template #action>
        <div class="app-wrap-value__value">
          {{ value }}
        </div>
      </template>
    </app-popover>
  </div>
</template>

<script lang="ts">
import { copyToClipboard, errorNotification, successNotification } from '@sdk5/shared/utils';
import { defineComponent } from 'vue';

import { AppPopover } from '../../ui-framework/app-popover';

export default defineComponent({
  name: 'AppWrapValue',
  components: { AppPopover },
  props: {
    value: { type: [String, Number], required: true },
  },
  methods: {
    copyData(): void {
      try {
        copyToClipboard(this.value.toString());
        successNotification('notification.copied');
      } catch (error) {
        errorNotification('notification.copy_failed');
      }
    },
  },
});
</script>

<style lang="scss">
.app-wrap-value {
  @apply relative w-full overflow-visible;

  &__hint {
    @apply flex items-center bg-blue-100 shadow-transparent text-gray-500 text-sm leading-none py-8 px-12;

    .popper__arrow::after {
      @apply border-t-blue-100 #{!important};
    }
  }

  &__button {
    @apply text-xs text-blue-600 mr-10 leading-none hover:text-primary transition;
  }

  &__value {
    @apply text-ellipsis whitespace-nowrap w-full cursor-pointer overflow-hidden;
  }
}
</style>
