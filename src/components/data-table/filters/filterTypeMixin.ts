import { Component, Prop, Vue } from 'vue-property-decorator';
import { ITableFilter } from '@/types/interfaces/TableFilters.interface';

@Component
export default class FilterTypeMixin extends Vue {

  @Prop({
    type: Object,
    required: true,
  }) readonly filter!: ITableFilter;

  @Prop({
    type: Object,
    required: true,
  }) readonly filterValues!: {
    [key: string]: any;
  };

  get placeholder(): string {
    const { name, placeholder } = this.filter;
    return placeholder || name;
  }

}
