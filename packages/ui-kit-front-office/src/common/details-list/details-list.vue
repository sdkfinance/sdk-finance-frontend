<template>
  <div
    class="details-list details-list--front-office"
    :class="{ 'details-list--secondary': isSecondary }">
    <div class="details-list__title">
      <slot name="title">
        <h3>{{ $t(title) }}</h3>
      </slot>
    </div>
    <div class="details-list__body">
      <slot name="body">
        <div
          v-for="(detail, i) in details"
          v-show="!detail.hide"
          :key="`details_${i}`"
          class="details-list__row">
          <slot :name="detail.param">
            <div class="details-list__label">
              {{ $t(detail.label) }}
            </div>
            <div :class="getValueClass(detail.value)">
              {{ getDetailValue(detail.value) }}
            </div>
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDetailsValue } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { LocaleMessage } from 'vue-i18n';

export default defineComponent({
  name: 'DetailsList',
  props: {
    title: { type: String, default: '' },
    isSecondary: { type: Boolean, default: false },
    details: { type: Array as PropType<IDetailsValue[]>, default: () => [] },
  },
  methods: {
    getDetailValue<T>(value: T): T | LocaleMessage {
      return value ?? this.$t('placeholder.no_data');
    },
    getValueClass<R>(value: R): string[] {
      let noDataClass = '';

      if (value === null || value === undefined) {
        noDataClass = 'details-list__value--no-data';
      }

      return ['details-list__value', noDataClass];
    },
  },
});
</script>

<style lang="scss">
.details-list--front-office {
  @apply flex flex-col mb-24;

  .details-list {
    &__title {
      @apply text-base font-medium mb-16;
    }

    &__body {
      @apply p-20 rounded border border-gray-100 bg-gray-150;
      @apply flex-grow px-20 box-border;
    }

    &__row {
      @apply grid mb-10;

      grid-template-columns: minmax(165px, 50%) 1fr;
    }

    &__label {
      @apply text-sm font-semibold;
    }

    &__value {
      @apply text-sm font-medium break-normal break-words;

      &--no-data {
        @apply text-gray-375;
      }
    }
  }

  &.details-list--secondary {
    .details-list__body {
      @apply flex-grow p-0 bg-transparent border-none rounded-none;
    }

    .details-list__label {
      @apply text-base font-medium text-blue-500;
    }

    .details-list__value {
      @apply font-medium text-right text-base;
    }
  }
}
</style>
