import { IApiResponse } from '@/types/interfaces';

export interface IPointOfSaleRecord {
  txCategoryCode: string;
  id: string;
  name: string;
  description: string;
  website: string;
  active: boolean;
  secretCode: string;
  serverUrl: string;
  resultUrl: string;
  txCategoryId: string;
  trustAllCertificates: boolean;
  posCompanyName: string;
}

export interface IGetAllPointsOfSaleRecords {
  records: IPointOfSaleRecord[];
}

export interface IGetSpecificPointOfSale {
  pos: IPointOfSaleRecord;
}

export interface IPointsOfSaleCreate {
  posCompanyName: string;
  description: string;
  website?: string;
  serverUrl?: string;
  categoryId?: string;
  resultUrl?: string;
  trustAllCertificates?: boolean | null;
}

export interface IPointsOfSaleEdit extends IPointsOfSaleCreate {
  id?: string;
  secretCode?: string;
  active?: boolean;
}

export type IPointsOfSaleRecordsResponse = IApiResponse<IGetAllPointsOfSaleRecords>;

export type IPointsOfSaleResponse = IApiResponse<IPointOfSaleRecord>;

export type IGetSpecificPointsOfSaleResponse = IApiResponse<IGetSpecificPointOfSale>;

export type IGetPointsOfSaleApiResponse = IApiResponse<IPointOfSaleRecord>;
