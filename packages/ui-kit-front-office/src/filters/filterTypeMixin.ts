import { BaseTableFilter } from '@sdk5/shared/filters';
import type { TTableFilterValue, TTableFilterValues } from '@sdk5/shared/types';
import { cloneDeep } from 'lodash';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FilterTypeMixin',
  props: {
    filter: {
      type: BaseTableFilter,
      required: true,
    },
    filterValues: {
      type: Object as PropType<TTableFilterValues>,
      required: true,
    },
  },
  computed: {
    placeholder(): string {
      const { name, placeholder } = this.filter;
      return placeholder || name;
    },
    filterValueString(): string {
      return this.filter.displayValueString;
    },
    value(): TTableFilterValue {
      return cloneDeep(this.filter.value);
    },
  },
});
