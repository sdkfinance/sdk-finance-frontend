import {
  Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import { IFilterEmitValue, TFilters } from '@/types/interfaces/TableFilters.interface';
import deleteObjectEmptyFields from '@/utils/deleteObjectEmptyFields';

type TValues = { [key: string]: string };

export default (filterData: TFilters = [], namespace: string) => {
  @Module({
    name: namespace,
    namespaced: true,
  })
  class FiltersModule extends VuexModule {

    public values: TValues = {};

    public page: number = 1;

    public filterData: TFilters = filterData;

    get filters(): TFilters {
      return this.filterData.filter(({ check }) => !check || check({ role: this.context.rootState.UserData.role }));
    }

    get filterValues(): TValues {
      return deleteObjectEmptyFields(this.values || {});
    }

    @Mutation
    SET_FILTER_VALUES(filterValues: TValues): void {
      this.values = filterValues || {};
    }

    @Mutation
    SET_FILTER_VALUE({ value, key }: IFilterEmitValue): void {
      this.values = deleteObjectEmptyFields({
        ...this.values,
        [key]: value,
      });
    }

    @Mutation
    SET_PAGE(page: number | string) {
      this.page = Number(page);
    }

    @Mutation
    RESET() {
      this.values = {};
      this.page = 1;
    }

    @Mutation
    SET_FILTER(filters: TFilters) {
      this.filterData = filters;
    }

  }

  return FiltersModule;
};
