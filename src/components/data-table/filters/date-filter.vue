<template>
  <div class="date-filter">
    <app-date-picker
      :prefix-icon="''"
      :picker-options="pickerOptions"
      :value="value"
      :placeholder="$t(placeholder)"
      @change="emitChange"/>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model } from 'vue-property-decorator';

import FilterTypeMixin from '@/components/data-table/filters/filterTypeMixin';
import AppDatePicker from '@/components/ui-framework/app-date-picker.vue';
import { IFilterEmitValue, IFilterRange, TFilterRange } from '@/types/interfaces/TableFilters.interface';

@Component({
  components: { AppDatePicker },
})
export default class DateFilter extends FilterTypeMixin {

  @Model('change', {
    required: true,
  })
  readonly value!: string;

  get range(): IFilterRange | null {
    return this.filter.range || null;
  }

  get rangeValue(): string | undefined | null {
    const { param } = this.range || {};

    if (!param) {
      return null;
    }

    return this.filterValues[param];
  }

  get rangeType(): TFilterRange | null {
    return this.range?.type || null;
  }

  protected setHours(date: string): string {
    const newDate: Date = new Date(date);
    newDate.setHours(23, 59, 59, 999);

    return newDate.toISOString();
  }

  protected get pickerOptions(): object {
    const { type } = this.range || {};
    const { rangeValue } = this;

    return {
      disabledDate(time: Date): boolean {
        if (!rangeValue) return false;

        if (type === 'from') {
          return time.getTime() > new Date(rangeValue).getTime();
        }

        if (type === 'to') {
          return time.getTime() < new Date(rangeValue).getTime();
        }

        return false;
      },
    };
  }

  @Emit('change')
  emitChange(value: string): IFilterEmitValue {
    const date: string = (this.rangeType === 'to') ? this.setHours(value) : value;

    return {
      key: this.filter.param,
      value: value ? date : null,
    };
  }

}
</script>

<style lang="scss">
  .table-filter {
    &--range {
      .el-input {
        width: 130px;
      }

      &-from {
        margin-right: 0 !important;

        .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      &-to {
        .el-input__inner {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
</style>
