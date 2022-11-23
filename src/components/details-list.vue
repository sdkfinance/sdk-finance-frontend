<template>
  <div
    class="details-list"
    :class="{'details-list--secondary': isSecondary}">
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
import { LocaleMessage } from 'vue-i18n';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IDetailsValue } from '@/types/interfaces';

@Component
export default class DetailsList extends Vue {

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: Boolean, default: false }) readonly isSecondary!: boolean;

  @Prop({ type: Array, default: () => ([]) }) readonly details!: IDetailsValue[];

  protected getDetailValue<T>(value: T): T | LocaleMessage {
    return value ?? this.$t('placeholder.no_data');
  }

  protected getValueClass<R>(value: R): string[] {
    let noDataClass = '';

    if (value === null || value === undefined) {
      noDataClass = 'details-list__value--no-data';
    }

    return ['details-list__value', noDataClass];
  }

}
</script>

<style lang="scss">
  .details-list {
    @apply flex flex-col mb-24;

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
      @apply text-sm font-medium break-all;

      &--no-data {
        @apply text-gray-375;
      }
    }

    &--secondary {
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
