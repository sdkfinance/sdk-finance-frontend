<template>
  <div class="app-show-more">
    <span class="app-show-more__label">
      {{ $t('action.show_more.label', [currentCountFormat, totalCountFormat]) }}
    </span>

    <app-button
      outlined
      size="medium"
      native-type="button"
      :disabled="buttonDisabled"
      @click="showMoreButtonClickHandler">
      {{ $t('action.show_more.button') }}
    </app-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AppButton } from '../../ui-framework/app-button';

export default defineComponent({
  name: 'AppShowMoreButton',
  components: {
    AppButton,
  },
  props: {
    totalCount: { type: Number, required: true },
    currentCount: { type: Number, required: true },
    buttonDisabled: { type: Boolean, default: false },
  },
  computed: {
    totalCountFormat(): string {
      return this.totalCount.toLocaleString();
    },
    currentCountFormat(): string {
      return this.currentCount.toLocaleString();
    },
  },
  methods: {
    showMoreButtonClickHandler(): void {
      this.emitShowMoreEvent();
    },
    emitShowMoreEvent() {
      this.$emit('show-more');
    },
  },
});
</script>

<style scoped lang="scss">
.app-show-more {
  @apply flex items-center gap-x-[0.875rem];

  &__label {
    @apply text-blue-600 text-sm font-normal;
  }
}
</style>
