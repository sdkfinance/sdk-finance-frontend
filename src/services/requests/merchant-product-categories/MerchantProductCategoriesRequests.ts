import api from '@/services/api';
import { IMerchantProductCategories } from '@/services/requests/merchant-product-categories/MerchantProductCategories.types';

export const MerchantProductCategoriesRequests = {

  getRecords(): Promise<IMerchantProductCategories> {
    return api.get('/merchant-product-categories');
  },

};
