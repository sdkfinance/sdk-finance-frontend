<template>
  <div
    :class="triggerFilterClassNames"
    :role="currentButtonRole"
    :tabindex="currenTriggerTabIndex"
    @click="emitClickEvent">
    <span class="trigger-filter__placeholder">
      <slot
        name="placeholder"
        v-bind="{ placeholder }">
        {{ currentPlaceholder }}
      </slot>
    </span>
    <span
      v-if="valuesString"
      class="trigger-filter__values"
      >{{ valuesString }}</span
    >
    <template v-if="iconVisible">
      <i
        :class="['trigger-filter__icon', 'icon', currentIcon]"
        @click="triggerIconClickHandler($event)" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppDropdownTriggerFilterView',
  props: {
    isDropdownVisible: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    valuesString: {
      type: String,
      default: '',
    },
    iconVisible: {
      type: Boolean,
      default: true,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentButtonRole() {
      if (this.clickable) {
        return 'button';
      }

      return undefined;
    },
    currenTriggerTabIndex() {
      if (this.clickable) {
        return 0;
      }

      return undefined;
    },
    currentPlaceholder() {
      return `${this.$t(this.placeholder)}${this.valuesString ? ':' : ''}`;
    },
    currentIcon(): string {
      return this.valuesString ? 'icon-close' : 'icon-arrow-down-curv';
    },
    triggerFilterClassNames() {
      return ['trigger-filter', this.isDropdownVisible && 'trigger-filter--dropdown-visible', this.valuesString && 'trigger-filter--has-values'];
    },
  },
  methods: {
    triggerIconClickHandler(event: MouseEvent) {
      if (this.valuesString) {
        event.stopPropagation();
        this.emitClearFiltersEvent();
      }
    },
    emitClearFiltersEvent() {
      this.$emit('clear-filter');
    },
    emitClickEvent() {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss">
.trigger-filter.trigger-filter--dropdown-visible.trigger-filter--has-values {
  .trigger-filter {
    &__placeholder {
      @apply text-blue-200 opacity-[0.8];
    }

    &__values {
      @apply text-gray-100;
    }
  }
}

.trigger-filter {
  @apply flex items-center gap-x-[0.25rem];
  @apply rounded-[0.25rem] bg-blue-300 py-[0.3125rem] px-[0.5rem] text-sm text-blue-600 font-medium;

  &--dropdown-visible {
    @apply bg-primary text-gray-100;

    .trigger-filter__icon {
      @apply rotate-180;
    }
  }

  &__icon {
    @apply ml-0
      w-[1rem]
      h-[1rem]
      inline-flex
      items-center
      justify-center
      leading-normal
      origin-center
      text-inherit
      text-0.4em
      transition
      transform;
  }

  &__values {
    @apply text-gray-500 font-medium text-sm;
  }
}
</style>
