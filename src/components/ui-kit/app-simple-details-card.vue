<template>
  <div class="app-simple-card">
    <div
      v-for="(detail, i) in details"
      v-show="!detail.hide"
      :key="`row_${i}`"
      class="app-simple-card__row">
      <div class="app-simple-card__label">
        {{ $t(detail.label) }}
      </div>
      <div class="app-simple-card__value">
        <slot
          :name="detail.param"
          v-bind="{detail}">
          {{ getDetailValue(detail.value) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { LocaleMessage } from 'vue-i18n';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IDetailsValue } from '@/types/interfaces';

@Component
export default class AppSimpleDetailsCard extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly details!: IDetailsValue[];

  protected getDetailValue<T>(value: T): T | LocaleMessage {
    return value ?? this.$t('placeholder.no_data');
  }

}
</script>

<style lang="scss">
.app-simple-card {
  @apply rounded-lg bg-gray-350 pl-32 pr-32 pt-24 pb-24;

  &__row {
    @apply flex flex-col sm:flex-row items-start sm:items-center mb-8 sm:mb-16;

    &:last-of-type {
      @apply mb-0;
    }
  }

  &__label {
    min-width: 172px;

    @apply text-blue-500 text-sm font-medium mb-4 sm:mb-0 sm:mr-8 ;
  }

  &__value {
    @apply text-gray-500 text-sm font-medium;
  }
}

@media print {
  .app-simple-card {
    @apply table p-0;

    &__row {
      @apply table-row;
    }

    &__label,
    &__value {
      @apply table-cell pt-5 pb-5;
    }
  }
}
</style>
