<template>
  <div
    v-loading="isLoading"
    class="app-data-table">
    <table-filters
      v-if="filtersConfig"
      :filters="filtersConfig"
      :filter-values="filterValues"
      @change="setFilterValues"/>

    <slot/>

    <app-pagination
      v-if="!isLoading"
      :total="totalRecords"
      :page-size="10"
      :current-page="currentPage"
      @current-change="changePage"/>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Model,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import TableFilters from '@/components/data-table/table-filters.vue';
import AppPagination from '@/components/ui-framework/app-pagination.vue';
import { UserData } from '@/store/modules';
import { IPlainObject } from '@/types/interfaces';
import { IApiResponse } from '@/types/interfaces/ApiResponse.interface';
import { IPaginationRequestOptions } from '@/types/interfaces/PaginationRequest.interface';
import { IPaginationResponse } from '@/types/interfaces/PaginationResponse.interface';
import { IFilterEmitValue, TFilters } from '@/types/interfaces/TableFilters.interface';
import { getDecodedParams, isEmptyValue, serializeValues } from '@/utils';

type OnLoadApiResponse = IPaginationResponse<any>
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

@Component({
  components: {
    AppPagination,
    TableFilters,
  },
})
export default class AppDataTable extends Vue {

  @Model('change', {
    type: Array,
    required: true,
  }) readonly records!: object[];

  @Prop({ required: true }) readonly onLoad!: TOnLoad;

  @Prop({ default: null }) readonly filters!: TFilters;

  @Prop({
    type: String,
    default: null,
  }) readonly storeNamespace!: string | null;

  protected currentPage: number = 1;

  protected totalRecords: number = 0;

  protected isLoading: boolean = false;

  protected filterValues: IPlainObject = {};

  protected userData = getModule(UserData, this.$store);

  protected get filtersStore(): IFiltersStore | null {
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
  }

  protected get filtersConfig(): TFilters {
    if (this.filtersStore) {
      return this.filtersStore.filters;
    }

    const { role } = this.userData;
    return this.filters.filter(({ check }) => !check || check({ role }));
  }

  protected get defaultFilterValues() {
    return this.filtersConfig.reduce((acc, filter) => ({ ...acc, ...(filter.defaultValues ? filter.defaultValues : {}) }), {});
  }

  protected get filterParamNames(): string[] {
    return this.filtersConfig.map(({ param }) => param);
  }

  protected get queryParams(): ISeparatedQueryParams {
    return Object.entries(this.$route.query).reduce((
      params: ISeparatedQueryParams,
      [key, value]: [string, any],
    ) => {
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
    }, {
      filter: {},
      custom: {},
    });
  }

  protected get filterQueryParams(): { [key: string]: any } | null {
    const filterQueryEntries = Object.entries(this.queryParams.filter);

    if (!filterQueryEntries.length) {
      return null;
    }

    return filterQueryEntries.reduce(getDecodedParams, {});
  }

  protected get storeFilterValues(): { [key: string]: string } {
    return this.filtersStore?.filterValues || {};
  }

  @Watch('filterValues', { deep: true })
  protected handleFilterValuesChange(): void {
    if (this.filtersStore) {
      this.filtersStore.SET_FILTER_VALUES(this.filterValues);
    }

    const serializedValues = serializeValues(this.filterValues);

    this.changeQuery({
      ...this.queryParams.custom,
      ...serializedValues,
    });

    this.loadData();
  }

  @Watch('currentPage')
  protected handlePageChange() {
    if (this.filtersStore) {
      this.filtersStore.SET_PAGE(this.currentPage);
    }

    this.changeQuery({
      ...this.$route.query,
      page: this.currentPage,
    });
  }

  protected created(): void {
    this.currentPage = Number(this.queryParams.custom.page) || this.filtersStore?.page || 1;

    const filterValues = { ...this.defaultFilterValues, ...(this.filterQueryParams || this.storeFilterValues) };

    if (isEmptyValue(filterValues)) {
      this.loadData();
    } else {
      this.filterValues = filterValues;
    }
  }

  @Emit('change')
  protected emitChange(records: object[]): object[] {
    return records || [];
  }

  protected async changeQuery(params: { [key: string]: any }): Promise<void> {
    this.$router.replace({
      query: {
        page: params.page, // Should be first
        ...params,
      },
    }).catch(() => {});
  }

  public async loadData(options: IPaginationRequestOptions<any, any> = {}): Promise<OnLoadResponse> {
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

    const {
      records,
      totalRecords,
      pageNumber,
    } = response!;

    this.totalRecords = Number(totalRecords);
    this.currentPage = Number(pageNumber) + 1;
    this.emitChange(records);

    return { response, error };
  }

  protected setFilterValues({ key, value }: IFilterEmitValue): void {
    if (isEmptyValue(value)) {
      this.$delete(this.filterValues, key);
    } else {
      this.$set(this.filterValues, key, value);
    }

    this.currentPage = 1;
  }

  protected changePage(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

}
</script>
