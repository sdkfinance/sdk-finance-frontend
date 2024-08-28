<template>
  <div
    v-loading="isLoading"
    class="app-data-table">
    <table-filters
      v-if="visibleTableFilters.length > 0"
      :filters="visibleTableFilters"
      :filter-values="filterValues"
      @change="setFilterValues"
      @clear-filters="clearAllFilters" />

    <slot />

    <div class="app-data-table__footer">
      <app-pagination
        v-if="!isLoading"
        :total="totalRecords"
        :page-size="10"
        :current-page="currentPage"
        @current-change="changePage" />
      <app-horizontal-scrollbar
        v-if="!!$slots.default && showHorizontalScrollBar"
        scroll-element=".el-table__body-wrapper" />
      <app-show-more-button
        v-if="showShowMoreButton"
        :total-count="totalRecords"
        :current-count="currentRecords.length"
        :button-disabled="isShowMoreButtonDisabled"
        @show-more="showMoreHandler" />
    </div>
  </div>
</template>

<script lang="ts">
import { UserDataService } from '@sdk5/shared';
import type { BaseTableFilter } from '@sdk5/shared/filters';
import {
  TableDateFilter,
  TableEnumerationFilter,
  TableMultipleFilter,
  TablePeriodFilter,
  TableRangeFilter,
  TableSelectDateRangeFilter,
  TableSelectFilter,
  TableStringFilter,
} from '@sdk5/shared/filters';
import type {
  IApiResponse,
  IFilterEmitValue,
  IPaginationRequestOptions,
  IPaginationResponse,
  IPlainObject,
  ITableFilter,
  TFilters,
  TTableFilterValue,
  TTableFilterValues,
} from '@sdk5/shared/types';
import { getDecodedParams, isEmptyValue, serializeValues } from '@sdk5/shared/utils';
import type { PropType } from 'vue';
import { defineComponent, markRaw } from 'vue';

import { AppPagination } from '../ui-framework';
import { AppHorizontalScrollbar, AppShowMoreButton } from '../ui-kit';
import TableFilters from './table-filters.vue';

type OnLoadApiResponse = IPaginationResponse<any>;
type OnLoadResponse = IApiResponse<OnLoadApiResponse>;
type TOnLoad = (options: IPaginationRequestOptions<any, any>) => Promise<OnLoadResponse>;

interface ISeparatedQueryParams {
  filter: { [key: string]: any };
  custom: { [key: string]: any };
}

interface IFiltersStore {
  filters: TFilters;
  page: number;
  filterValues: { [key: string]: any };
  SET_PAGE: (page: number) => void;
  SET_FILTER_VALUES: (values: { [key: string]: any }) => void;
}

export default defineComponent({
  name: 'AppDataTable',
  components: {
    AppShowMoreButton,
    AppHorizontalScrollbar,
    AppPagination,
    TableFilters,
  },
  model: {
    prop: 'records',
    event: 'change',
  },
  props: {
    records: {
      type: Array as PropType<IPlainObject[]>,
      default: () => [],
    },
    onLoad: {
      required: true,
      type: Function as PropType<TOnLoad>,
    },
    filters: {
      default: null,
      type: Array as PropType<ITableFilter[] | null>,
    },
    storeNamespace: {
      type: String,
      default: null,
    },
    showHorizontalScrollBar: {
      type: Boolean,
      default: false,
    },
    showShowMoreButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const filterInstances: BaseTableFilter[] = [];
    const isLoading: boolean = false;
    const totalPages: number = 0;
    const currentRecords: any[] = [];
    const totalRecords: number = 0;
    const currentPage: number = 1;

    return {
      currentPage,
      totalRecords,
      currentRecords,
      totalPages,
      isLoading,
      filterInstances,
    };
  },
  computed: {
    filterValues(): TTableFilterValues {
      return this.visibleTableFilters.reduce((result, filterInstance) => {
        const record = {
          ...result,
          ...filterInstance.filterValueRecord,
        };
        return record;
      }, {} as TTableFilterValues);
    },
    isShowMoreButtonDisabled(): boolean {
      return this.currentPage + 1 > this.totalPages;
    },
    filtersStore(): IFiltersStore | null {
      if (!this.storeNamespace) {
        return null;
      }

      return {
        filters: this.$store.getters[`${this.storeNamespace}/filters`],
        page: this.$store.state[`${this.storeNamespace}/page`],
        filterValues: this.$store.getters[`${this.storeNamespace}/filterValues`],
        SET_PAGE: (page) => this.$store.commit(`${this.storeNamespace}/SET_PAGE`, page),
        SET_FILTER_VALUES: (values) => this.$store.commit(`${this.storeNamespace}/SET_FILTER_VALUES`, values),
      };
    },
    filtersConfig(): ITableFilter[] {
      if (this.filtersStore !== null) {
        return this.filtersStore.filters;
      }

      return this.filters ?? [];
    },
    visibleTableFilters(): BaseTableFilter[] {
      if (this.filtersStore) {
        return this.filterInstances as BaseTableFilter[];
      }

      return this.filterInstances.filter(({ check }) => !check || check({ role: UserDataService.role })) as BaseTableFilter[];
    },
    defaultFilterValues() {
      return this.visibleTableFilters.reduce(
        (acc, filter) => ({
          ...acc,
          ...(filter.defaultValues ? filter.defaultValues : {}),
        }),
        {},
      );
    },
    filterParamNames(): string[] {
      return this.visibleTableFilters
        .map(({ param, rangeOptions }) => {
          if (rangeOptions) {
            const {
              to: { param: toParam },
              from: { param: fromParam },
            } = rangeOptions;
            return [fromParam, toParam];
          }

          return param;
        })
        .flat();
    },
    queryParams(): ISeparatedQueryParams {
      return Object.entries(this.$route.query).reduce(
        (params: ISeparatedQueryParams, [key, value]: [string, any]) => {
          const isFilterParam = this.filterParamNames.includes(key);
          const targetKey = isFilterParam ? 'filter' : 'custom';
          const targetObject = params[targetKey];

          return {
            ...params,
            [targetKey]: {
              ...targetObject,
              [key]: value,
            },
          };
        },
        {
          filter: {},
          custom: {},
        },
      );
    },
    filterQueryParams(): Record<string, TTableFilterValue> | null {
      const filterQueryEntries = Object.entries(this.queryParams.filter);

      if (!filterQueryEntries.length) {
        return null;
      }

      const filterQueryParams = filterQueryEntries.reduce(getDecodedParams, {});
      const filterQueryParamsWithRangeData = this.getRangeFiltersDataFromQueryParams(filterQueryParams);
      return {
        ...filterQueryParams,
        ...filterQueryParamsWithRangeData,
      };
    },
    storeFilterValues(): { [key: string]: string } {
      return this.filtersStore?.filterValues || {};
    },
  },
  watch: {
    filterValues: [{ deep: true, handler: 'handleFilterValuesChange' }],
    currentPage: [
      {
        handler: 'handlePageChange',
      },
    ],
    filtersConfig: [
      {
        deep: true,
        handler: 'filtersPropChangeHandler',
      },
    ],
  },
  created(): void {
    this.initTableFilters();

    this.setPage(Number(this.queryParams.custom.page) || this.filtersStore?.page || 1);

    const filterValues = {
      ...this.defaultFilterValues,
      ...(this.filterQueryParams || this.storeFilterValues),
    } as TTableFilterValues;

    if (!isEmptyValue(filterValues)) {
      this.setInitialFiltersData(filterValues);
    }

    this.loadData();
  },
  methods: {
    getRangeFiltersDataFromQueryParams(filterQueryParams: Record<string, string>): Record<string, TTableFilterValue> {
      const filterRangeConfigs = this.filters!.filter(
        (filterConfig): filterConfig is Required<Pick<ITableFilter, 'rangeOptions'>> & ITableFilter => !!filterConfig.rangeOptions,
      );

      if (filterRangeConfigs.length === 0) {
        return filterQueryParams;
      }

      return filterRangeConfigs.reduce(
        (acc, current) => {
          const {
            from: { param: fromParam },
            to: { param: toParam },
          } = current.rangeOptions;

          const fromValueFromQueryParams = filterQueryParams[fromParam];
          const toValueFromQueryParams = filterQueryParams[toParam];

          if (!fromValueFromQueryParams || !toValueFromQueryParams) {
            return acc;
          }

          acc[current.param] = [fromValueFromQueryParams, toValueFromQueryParams];

          return acc;
        },
        { ...filterQueryParams } as Record<string, TTableFilterValue>,
      );
    },
    async changeQuery(params: { [key: string]: any }): Promise<void> {
      this.$router
        .replace({
          query: {
            page: params.page, // Should be first
            ...params,
          },
        })
        .catch(() => {});
    },
    async loadData(options: IPaginationRequestOptions<any, any> = {}, concatRecords = false): Promise<OnLoadResponse> {
      const filter = Object.keys(this.filterValues).length ? { ...this.filterValues } : null;

      this.isLoading = true;
      const { response, error } = await this.onLoad({
        filter,
        ...options,
        pageNumber: this.currentPage - 1 || 0,
      });
      this.isLoading = false;

      if (error) {
        return { response, error };
      }

      const { records, totalRecords, pageNumber, totalPages } = response!;
      this.totalPages = totalPages;
      this.totalRecords = Number(totalRecords);
      this.currentRecords = concatRecords ? [...this.currentRecords, ...records] : records;
      this.setPage(Number(pageNumber) + 1);
      this.emitChange(this.currentRecords);

      return { response, error };
    },
    getFilterInstanceByParam(param: string): BaseTableFilter | null {
      if (!param) {
        return null;
      }

      const filter = this.visibleTableFilters.find((filterInstance) => filterInstance.param === param);
      return filter ?? null;
    },
    setFilterValues(options: IFilterEmitValue | IFilterEmitValue[]): void {
      const setValue = (option: IFilterEmitValue) => {
        const { key, value } = option;
        const existingFilterInstance = this.getFilterInstanceByParam(key);

        if (!existingFilterInstance) {
          return;
        }

        existingFilterInstance.value = value;
      };

      if (Array.isArray(options)) {
        options.forEach(setValue, this);
      } else {
        setValue.call(this, options);
      }

      this.changePage(1);
    },
    changePage(page: number): void {
      this.setPage(page);
      this.loadData();
    },
    setPage(page: number): void {
      this.currentPage = page;
    },
    showMoreHandler() {
      if (this.currentPage + 1 > this.totalPages) {
        return;
      }

      this.setPage(this.currentPage + 1);
      this.loadData({}, true);
    },
    clearAllFilters(): void {
      this.setFilterValues(this.filterInstances.map((filter) => ({ key: filter.param, value: null })));
    },
    initTableFilters() {
      let filtersConfig: ITableFilter[] = [];

      if (this.filtersStore) {
        filtersConfig = this.filtersStore.filters;
      } else {
        filtersConfig = this.filters ?? [];
      }

      if (this.filterInstances.length === 0) {
        this.filterInstances = filtersConfig.map((filterConfig) => this.createNewTableFilter(filterConfig));
      }
    },
    tableFiltersConfigUpdateHandler(filtersConfig: ITableFilter[]) {
      if (!filtersConfig) {
        return;
      }

      filtersConfig.forEach((filterConfig) => {
        const { param } = filterConfig;
        const existingFilter = this.getFilterInstanceByParam(param);

        if (!existingFilter) {
          this.filterInstances.push(this.createNewTableFilter(filterConfig));
        } else {
          existingFilter.updateOptions(filterConfig);
        }
      });
    },
    setInitialFiltersData(initialData: TTableFilterValues) {
      Object.entries(initialData).forEach(([param, value]) => {
        const filterInstance = this.getFilterInstanceByParam(param);

        if (filterInstance && !isEmptyValue(value)) {
          filterInstance.value = value;
        }
      });
    },
    tableFilterFactory(filterConfig: ITableFilter): BaseTableFilter {
      const { type } = filterConfig;
      const filterConstructors: Record<ITableFilter['type'], new (ctor: ITableFilter) => BaseTableFilter> = {
        Enumeration: TableEnumerationFilter,
        Select: TableSelectFilter,
        String: TableStringFilter,
        Range: TableRangeFilter,
        Date: TableDateFilter,
        Multiple: TableMultipleFilter,
        SelectDateRange: TableSelectDateRangeFilter,
        Period: TablePeriodFilter,
      };

      return new filterConstructors[type](filterConfig);
    },
    createNewTableFilter(filterConfig: ITableFilter): BaseTableFilter {
      return markRaw(this.tableFilterFactory(filterConfig));
    },
    handleFilterValuesChange(): void {
      if (this.filtersStore) {
        this.filtersStore.SET_FILTER_VALUES(this.filterValues);
      }

      const serializedValues = serializeValues(this.filterValues);

      this.changeQuery({
        ...this.queryParams.custom,
        ...serializedValues,
      });
    },
    handlePageChange() {
      if (this.filtersStore) {
        this.filtersStore.SET_PAGE(this.currentPage);
      }

      this.changeQuery({
        ...this.$route.query,
        page: this.currentPage,
      });
    },
    filtersPropChangeHandler(filtersConfig: typeof this.filters) {
      if (!filtersConfig) {
        return;
      }

      this.tableFiltersConfigUpdateHandler(filtersConfig);
    },
    emitChange(records: object[]) {
      this.$emit('change', records || [], records);
    },
  },
});
</script>

<style lang="scss" scoped>
.app-data-table {
  &__footer {
    @apply whitespace-nowrap w-full overflow-hidden gap-x-[5.4063rem] flex items-center justify-between mt-[3.5rem];
  }
}
</style>
