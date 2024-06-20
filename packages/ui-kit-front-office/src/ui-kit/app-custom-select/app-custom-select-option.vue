<template>
  <div
    class="app-custom-select-option"
    @click="$emit('click')">
    <div class="app-custom-select-option__content">
      <div class="app-custom-select-option__icon">
        <div
          class="app-custom-select-option__icon-bg"
          :style="{ backgroundColor: color }" />
        <span :style="{ color }">{{ customInitials || initials }}</span>
        <img
          v-if="withLogo"
          :src="logoMini"
          class="app-custom-select-option__icon-logo"
          alt="" />
      </div>
      <div>
        <div class="app-custom-select-option__title">
          {{ title }}
        </div>
        <div class="app-custom-select-option__subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>
    <div
      v-if="isActionAvailable"
      v-click-outside="closeConfirm"
      class="app-custom-select-option__action-block"
      @click.stop>
      <transition-group name="page">
        <button
          v-if="!isConfirmVisible"
          key="action"
          class="app-custom-select-option__action"
          type="button"
          :class="actionIcon"
          @click="isConfirmVisible = true" />
        <div
          v-else
          key="confirm"
          class="app-custom-select-option__action-confirm">
          <div class="app-custom-select-option__title">
            {{ $t('other.delete_template') }}
          </div>
          <div class="app-custom-select-option__action-buttons">
            <button
              class="text-red-main mr-10"
              type="button"
              @click="onAction">
              {{ $t('action.yes_delete') }}
            </button>
            <button
              type="button"
              @click="closeConfirm">
              {{ $t('action.no_cancel') }}
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import logoMini from '../../assets/icons/logo-mini.svg';

export default defineComponent({
  name: 'AppCustomSelectOption',
  props: {
    color: { type: String, default: '#10233A' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    withLogo: { type: Boolean, default: false },
    actionIcon: { type: String, default: 'icon-trash-loose' },
    isActionAvailable: { type: Boolean, default: true },
    customInitials: { type: String, default: '' },
  },
  data() {
    const isConfirmVisible: boolean = false;

    return {
      logoMini,
      isConfirmVisible,
    };
  },
  computed: {
    initials(): string {
      const [firstPart, secondPart] = this.title.split(' ');
      const firstLetter: string = firstPart?.toUpperCase()?.charAt(0) || '';
      const secondLetter: string = secondPart?.toUpperCase()?.charAt(0) || '';

      return `${firstLetter}${secondLetter}`;
    },
  },
  methods: {
    closeConfirm(): void {
      this.isConfirmVisible = false;
    },
    onAction() {
      this.$emit('action-click', true);
    },
  },
});
</script>

<style lang="scss">
.app-custom-select-option {
  @apply flex justify-between items-center cursor-pointer py-6 hover:bg-gray-350 px-2 rounded-sm transition;

  &__icon {
    @apply relative w-40 h-40;
    @apply flex justify-center items-center text-sm uppercase mr-8 font-semibold;

    &-bg {
      @apply absolute z-0 opacity-20 inset-0 rounded-round overflow-hidden;
    }

    &-logo {
      @apply absolute right-0 bottom-0;
    }
  }

  &__content {
    @apply flex;
  }

  &__title {
    @apply text-base text-gray-500 mb-3 font-medium;
  }

  &__subtitle {
    @apply text-sm uppercase text-blue-500;
  }

  &__action {
    @apply text-xs text-blue-400 hover:text-primary transition w-20;

    &-buttons {
      @apply flex items-center text-blue-500 text-sm;

      button {
        @apply hover:text-primary transition;
      }
    }
  }
}
</style>
