import apiConfigInstance from '../../api';
import type { IMerchantProductCategories } from './MerchantProductCategories.types';

export const MerchantProductCategoriesRequests = {
  getRecords(): Promise<IMerchantProductCategories> {
    return apiConfigInstance.api.get('/merchant-product-categories');
  },
};
