import { IApiResponse } from '@/types/interfaces';

export interface IMerchantProductCategory {
  id: number;
  externalCode: string;
  name: string;
  description: string;
}

export type IMerchantProductCategories = IApiResponse<{ records: IMerchantProductCategory[]}>;
