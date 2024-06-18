import { UserData } from '@sdk5/shared/store';
import { defineComponent } from 'vue';
import { getModule } from 'vuex-module-decorators';

import FilterTypeMixin from './filterTypeMixin';

interface IOption {
  label: string;
  value: string | number;
}

export default defineComponent({
  name: 'SelectFilterMixin',
  extends: FilterTypeMixin,
  data() {
    return {
      userData: getModule(UserData, this.$store),
    };
  },
  computed: {
    options(): IOption[] {
      const { options } = this.filter;
      const { role } = this.userData;

      if (Array.isArray(options)) {
        return options;
      }

      const filterOptions = typeof options === 'function' ? options({ role }) : options;

      return Object.entries(filterOptions!).map(([value, label]) => ({ value, label }));
    },
  },
});
