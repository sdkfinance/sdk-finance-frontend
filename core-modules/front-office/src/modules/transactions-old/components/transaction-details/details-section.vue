<template>
  <div class="transaction-details-section">
    <div class="transaction-details-section__top">
      <div class="transaction-details-section__title">
        {{ $t(title) }}
      </div>
      <slot name="action" />
    </div>
    <div class="transaction-details-section__content">
      <template v-for="(detail, index) of detailsVisible">
        <div
          :key="index"
          class="transaction-details-section__row details-row">
          <div class="details-row__title">
            <slot
              :name="`${detail.param}-title`"
              v-bind="{ detail }">
              {{ $t(detail.label) }}
            </slot>
          </div>
          <div class="details-row__value">
            <template v-if="detail.value === null || typeof detail.value === 'undefined'">
              {{ $t('placeholder.no_data') }}
            </template>
            <template v-else>
              <slot
                :name="`${detail.param}-value`"
                v-bind="{ detail }">
                {{ detail.value }}
              </slot>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import type { IDetailsValue } from '@sdk5/shared/types';
import { AppBadge, AppIdViewer } from '@sdk5/ui-kit-front-office';
import type { PropType, VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppBadge,
  AppIdViewer,
} as const;

@Component({
  components: COMPONENTS,
})
export default class DetailsSection extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: String, required: true }) readonly title!: string;

  @Prop({ type: Array as PropType<IDetailsValue[]>, required: true }) readonly details!: IDetailsValue[];

  $props!: {
    title: string;
    details: IDetailsValue[];
  };

  $scopedSlots!: {
    action: () => VNode[];
    [key: string]: (bindings: { detail: IDetailsValue }) => VNode[];
  };

  protected get detailsVisible() {
    return this.details.filter((detail) => !detail.hide);
  }

  protected get detailsVisibleFormatted() {
    return this.detailsVisible.map((detail) => {
      return {
        ...detail,
        value: detail.value ?? this.$t('placeholder.no_data').toString(),
      };
    });
  }
}
</script>

<style lang="scss">
.transaction-details-section {
  @apply flex flex-col gap-y-[1.5rem] p-[1.5rem] pb-[2rem] overflow-hidden border-b border-solid border-b-blue-400 last-of-type:border-b-transparent;

  &__top {
    @apply flex items-center justify-between;
  }

  &__title {
    @apply text-xl leading-[1.5rem] font-semibold text-gray-500;
  }

  &__content {
    @apply flex flex-col gap-y-[1rem];
  }

  .details-row {
    @apply grid items-center;

    grid-template-columns: 15rem 1fr;

    &__title,
    &__value,
    &__value .id-viewer__text {
      @apply text-md font-medium;
    }

    &__title {
      @apply text-gray-500;
    }

    &__value {
      &,
      .id-viewer__text {
        @apply text-blue-600 overflow-hidden;
      }

      .badge {
        @apply pl-0 pt-0 capitalize;
      }
    }
  }
}
</style>
