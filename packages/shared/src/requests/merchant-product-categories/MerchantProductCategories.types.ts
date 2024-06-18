import type { IApiResponse } from '../../types';

export interface IMerchantProductCategory {
  id: number;
  externalCode: string;
  name: string;
  description: string;
}

export type IMerchantProductCategories = IApiResponse<{ records: IMerchantProductCategory[] }>;
