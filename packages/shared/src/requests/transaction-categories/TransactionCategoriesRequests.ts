import apiConfigInstance from '../../api';
import type { IGetTransactionCategory, ITransactionCategoryOptions } from './TransactionCategories.types';

export const TransactionCategoriesRequests = {
  getRecords(options: ITransactionCategoryOptions): Promise<IGetTransactionCategory> {
    return apiConfigInstance.api.post('/transaction-categories/view', options);
  },
};
