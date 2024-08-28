import { UserDataService } from '@sdk5/shared';
import { defineComponent } from 'vue';

import FilterTypeMixin from './filterTypeMixin';

interface IOption {
  label: string;
  value: string | number;
}

export default defineComponent({
  name: 'SelectFilterMixin',
  extends: FilterTypeMixin,

  computed: {
    options(): IOption[] {
      const { options } = this.filter;

      if (Array.isArray(options)) {
        return options;
      }

      const filterOptions = typeof options === 'function' ? options({ role: UserDataService.role }) : options;

      return Object.entries(filterOptions!).map(([value, label]) => ({ value, label }));
    },
  },
});
