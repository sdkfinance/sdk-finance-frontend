<template>
  <div class="table-filter folded-filter__container">
    <template v-if="chosenFilter && isChosenFilterVisible">
      <app-filter-wrapper
        :filter-values="filterValues"
        :filter="chosenFilter"
        @change="emitChange" />
    </template>

    <app-dropdown
      v-if="filters.length"
      v-model="chosenFilter"
      :options="filterOptions"
      :option-label="getLabelFn"
      option-value="value"
      filter-view
      secondary>
      <template #trigger="{ isDropDownVisible }">
        <app-dropdown-trigger-filter-view
          :icon-visible="false"
          :is-dropdown-visible="isDropDownVisible"
          :placeholder="'Add filter'">
          <template #placeholder="{ placeholder }">
            <span class="folded-filter__trigger-placeholder">
              <i class="icon icon-plus" />
              <span>{{ placeholder }}</span>
            </span>
          </template>
        </app-dropdown-trigger-filter-view>
      </template>
    </app-dropdown>
  </div>
</template>

<script lang="ts">
import { BaseTableFilter } from '@sdk5/shared/filters';
import type { IOption, ITableFilter, TTableFilterValues } from '@sdk5/shared/types';
import type { PropType, Ref } from 'vue';
import { defineComponent, ref } from 'vue';

import { AppDropdown, AppDropdownTriggerFilterView } from '../ui-framework';
import AppFilterWrapper from './app-filter-wrapper.vue';

export default defineComponent({
  name: 'AppFoldedFilter',
  components: {
    AppFilterWrapper,
    AppDropdown,
    AppDropdownTriggerFilterView,
  },
  props: {
    filters: {
      type: Array as PropType<BaseTableFilter[]>,
      required: true,
    },
    filterValues: {
      type: Object as PropType<TTableFilterValues>,
      required: true,
    },
  },
  setup() {
    const chosenFilter = ref(null) as Ref<BaseTableFilter | null>;

    return { chosenFilter };
  },
  computed: {
    filterOptions(): IOption[] {
      return this.filters.map((filter) => ({
        label: this.$t(filter?.label ?? '').toString(),
        value: filter as unknown as string,
      }));
    },
    isChosenFilterVisible(): boolean {
      return this.chosenFilter !== null && this.chosenFilter instanceof BaseTableFilter;
    },
  },
  methods: {
    getLabelFn({ label }: { label: string }): string {
      return this.$t(label).toString();
    },
    emitChange(value: ITableFilter) {
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss">
@import '../assets/styles/tools/variables';

.folded-filter {
  &__container {
    @apply inline-flex items-center gap-x-[0.25rem];
  }

  &__trigger-placeholder {
    @apply flex items-center gap-x-[0.25rem];

    i::before {
      @apply text-[0.6rem];
    }
  }
}

.app-folded-filter-label {
  width: 100%;

  .el-select {
    .el-input,
    .el-input.is-focus {
      .el-input__inner {
        padding: 0;
        background-color: transparent;
        border: none;
        color: inherit;
        font-size: 12px;
        font-weight: 600;
      }

      .el-icon-arrow-up::before {
        color: #000;
      }
    }

    .el-input__suffix {
      right: -5px;
    }

    .el-input.is-focus {
      .el-input__inner,
      .el-icon-arrow-up::before {
        color: $primary-color;
      }
    }
  }
}
</style>
