import type { ITableFilter } from '../../types';
import { BaseTableFilter } from '../BaseTableFilter';

export class TableBaseRangeFilter extends BaseTableFilter {
  constructor(filterConfig: ITableFilter) {
    super(filterConfig);
    const { rangeOptions } = filterConfig;

    if (!rangeOptions) {
      throw new Error('Range options must be provided');
    }
  }
}
