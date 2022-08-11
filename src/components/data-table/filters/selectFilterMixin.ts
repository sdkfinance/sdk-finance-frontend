import { Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import FilterTypeMixin from '@/components/data-table/filters/filterTypeMixin';
import { UserData } from '@/store/modules';

interface IOption {
  label: string;
  value: string | number;
}

@Component
export default class SelectFilterMixin extends FilterTypeMixin {

  private userData = getModule(UserData, this.$store);

  get options(): IOption[] {
    const { options } = this.filter;
    const { role } = this.userData;

    if (Array.isArray(options)) {
      return options;
    }

    const filterOptions = typeof options === 'function'
      ? options({ role })
      : options;

    return Object.entries(filterOptions!).map(([value, label]) => ({ value, label }));
  }

}
