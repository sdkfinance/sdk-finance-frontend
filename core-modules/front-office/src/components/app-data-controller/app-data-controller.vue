<template>
  <div class="app-data">
    <div
      v-sticky
      class="app-data__header">
      <div class="app-data__header-content">
        <app-filters
          class="app-data__filters"
          :filters="filters"
          :filter-values="filterValues"
          @change="onFilterChange" />
        <div
          v-if="isControlsVisible"
          class="app-data__controls">
          <div class="app-data__controls-left">
            <slot name="additional-controls" />

            <app-switch
              v-if="allSlots.prepend"
              v-model="isPrependContentVisible"
              class="ml-20"
              secondary
              :label="$t(prependSwitchLabel)"
              is-label-after />
          </div>
          <div class="app-data__controls-right">
            <app-search
              v-if="searchFilter"
              v-model="search"
              @clear="fetchRecords"
              @keyup.enter="fetchRecords"
              @blur="fetchRecords" />
            <i
              v-if="withExport"
              role="button"
              class="icon-export-scv app-data__icon"
              :class="{ 'app-data__icon--disabled': isExportLoading }"
              @click="exportCsvButtonClickHandler" />
          </div>
        </div>
      </div>
    </div>
    <div class="app-data__content">
      <transition name="fade">
        <div
          v-if="isPrependContentVisible && allSlots.prepend"
          class="app-data__prepend">
          <slot
            name="prepend"
            v-bind="{ records, isLoading, isLastPage, requestParams }" />
        </div>
      </transition>
      <slot v-bind="{ records, isLoading, isLastPage, requestParams }" />
    </div>
    <div
      v-if="!isLastPage"
      class="app-data__load">
      <app-button
        secondary
        :is-loading="isLoading"
        class="min-w-128"
        @click="loadMore">
        {{ $t('action.load_more') }}
      </app-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { IFilterEmitValue, IPlainObject, ITableFilter } from '@sdk5/shared/types';
import { getDecodedParamValue, isEmptyValue, serializeValues } from '@sdk5/shared/utils';
import { AppButton, AppSearch, AppSwitch, TableFilters } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

import AppFilters from './app-filters.vue';

interface IPagination {
  page: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

interface IRequestParams {
  pageNumber: number;
  filter: IPlainObject;
  sort: IPlainObject;
}

const START_PAGE = 0;
const PAGE_SIZE = 10;

@Component({
  components: {
    AppButton,
    AppSwitch,
    AppFilters,
    AppSearch,
    TableFilters,
  },
})
export default class AppDataController extends Vue {
  @Prop({ type: Function, required: true }) readonly onLoad!: Function;

  @Prop({ type: Array, default: () => [] }) readonly filters!: ITableFilter[];

  @Prop({ type: String, default: 'action.on_the_map' }) readonly prependSwitchLabel!: string;

  @Prop({ type: String, default: '' }) readonly searchFilter!: string;

  @Prop({ type: Boolean, default: false }) readonly withExport!: string;

  @Prop({ type: Object, default: () => ({}) }) readonly defaultParams!: IPlainObject;

  @Prop({ type: Boolean, default: false }) readonly isExportLoading!: boolean;

  protected isPrependContentVisible: boolean = false;

  protected filterValues: IPlainObject = {};

  protected records: IPlainObject[] = [];

  protected search: string = '';

  protected isLoading: boolean = false;

  protected pagination: IPagination = {
    page: START_PAGE + 1,
    totalPages: 0,
    totalRecords: 0,
    pageSize: PAGE_SIZE,
  };

  @Emit('loading')
  protected onLoading(loading: boolean): boolean {
    this.isLoading = loading;
    return loading;
  }

  @Emit('get-export')
  protected getExport(): IRequestParams {
    return this.requestParams;
  }

  protected get isLastPage(): boolean {
    return this.pagination.page === this.pagination.totalPages || this.pagination.totalPages === 0;
  }

  protected get filterParams(): string[] {
    return this.filters.map(({ param }: ITableFilter) => param);
  }

  protected get paginationParams(): string[] {
    return Object.keys(this.pagination);
  }

  protected get allSlots(): IPlainObject {
    return { ...this.$scopedSlots, ...this.$slots };
  }

  protected get isControlsVisible(): boolean {
    return !!(this.withExport || this.searchFilter || this.allSlots.prepend);
  }

  protected get requestParams(): IRequestParams {
    const { searchFilter, search } = this;

    return {
      pageNumber: this.pagination.page - 1 || START_PAGE,
      filter: {
        ...(this.defaultParams?.filter || {}),
        ...(this.filterValues || {}),
        ...(searchFilter ? { [searchFilter]: search } : {}),
      },
      sort: {
        ...(this.defaultParams?.sort || {}),
      },
    };
  }

  @Watch('filterValues', { deep: true })
  protected async onFiltersChanged(filter: IPlainObject): Promise<void> {
    this.setQueryParams(filter);
    await this.fetchRecords();
  }

  protected onFilterChange({ key, value }: IFilterEmitValue): void {
    if (isEmptyValue(value)) {
      this.$delete(this.filterValues, key);
    } else {
      this.$set(this.filterValues, key, value);
    }

    this.pagination.page = 1;
  }

  protected created(): void {
    const { filter, pagination } = this.getQueryValues();
    this.pagination = { ...this.pagination, ...pagination };

    const defaultFilterValues = this.filters.reduce((acc, { defaultValues }) => {
      if (defaultValues) {
        return { ...acc, ...defaultValues };
      }

      return acc;
    }, {});

    this.filterValues = { ...this.filterValues, ...defaultFilterValues, ...filter };
  }

  protected setQueryParams(filter: IPlainObject, position: { x?: number; y?: number } = {}): void {
    this.$router
      .replace({
        query: {
          // It's temporary solution, while we don't use page in query params
          // page: String(this.pagination.page)
          ...serializeValues(filter),
        },
        params: {
          viewPosition: position as string,
        },
      })
      .catch(() => ({}));
  }

  protected getQueryValues(): { filter: IPlainObject; pagination: IPlainObject } {
    return Object.entries(this.$route.query).reduce(
      (acc, [key, value]) => {
        if (this.filterParams.includes(key)) {
          const filterValues = { ...acc.filter, [key]: getDecodedParamValue(value) };
          return { ...acc, filter: filterValues };
        }

        if (this.paginationParams.includes(key)) {
          const paginationValues = { ...acc.pagination, [key]: getDecodedParamValue(value) };
          return { ...acc, pagination: paginationValues };
        }

        return acc;
      },
      { filter: {}, pagination: {} },
    );
  }

  public async fetchRecords(): Promise<void> {
    this.onLoading(true);
    const { response, error } = await this.onLoad(this.requestParams);
    this.onLoading(false);

    if (error || !response) {
      this.records = [];
      return;
    }

    const { records, totalPages, pageNumber, totalRecords, pageSize } = response;

    this.pagination = {
      page: Number(pageNumber) + 1,
      totalPages,
      totalRecords,
      pageSize,
    };

    if (pageNumber === 0) {
      this.records = response.records;
      return;
    }

    this.records = [...this.records, ...records];
  }

  protected async loadMore(): Promise<void> {
    this.pagination.page += 1;
    const { scrollY } = window;
    await this.fetchRecords();
    // It's temporary solution, while we don't use page in query params
    // this.setQueryParams(this.filterValues, { x: 0, y: scrollY });
    window.scroll({ top: scrollY, left: 0 });
  }

  protected exportCsvButtonClickHandler() {
    if (this.isExportLoading) {
      return;
    }

    this.getExport();
  }
}
</script>

<style lang="scss">
.app-data {
  &__header {
    @apply sticky
      -top-24
      sm:-top-45
      z-30
      bg-white
      pt-30
      pb-30
      pl-24
      pr-24
      md:pl-45
      md:pr-45
      md:pt-36
      md:pb-36
      transition
      transition-shadow
      duration-500
      ml-half-width
      mr-half-width;

    &.is-sticky {
      @apply shadow-md-bottom;
    }

    &-content {
      @apply flex md:items-center flex-col md:flex-row justify-between general-container;
    }
  }

  &__filters {
    @apply flex items-center;
  }

  &__controls {
    @apply flex items-center justify-between md:justify-start mt-30 md:mt-0;

    &-right {
      @apply flex items-center ml-20;
    }
  }

  &__icon {
    @apply text-sm text-blue-600 ml-20 leading-none cursor-pointer;

    &--disabled {
      @apply cursor-not-allowed opacity-50;
    }
  }

  &__prepend {
    @apply mb-32;
  }

  &__load {
    @apply flex items-center justify-center mt-32;
  }
}
</style>
