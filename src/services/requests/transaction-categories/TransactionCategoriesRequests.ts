import api from '@/services/api';
import {
  IGetTransactionCategory,
  ITransactionCategoryOptions,
} from '@/services/requests/transaction-categories/TransactionCategories.types';

export const TransactionCategoriesRequests = {

  getRecords(options: ITransactionCategoryOptions): Promise<IGetTransactionCategory> {
    return api.post('/transaction-categories/view', options);
  },

};
