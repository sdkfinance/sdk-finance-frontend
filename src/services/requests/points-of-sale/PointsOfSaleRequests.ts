import api from '@/services/api';

import {
  IPointsOfSaleEdit,
  IPointsOfSaleCreate,
  IPointsOfSaleResponse,
  IPointsOfSaleRecordsResponse,
  IGetSpecificPointsOfSaleResponse,
} from '@/services/requests/points-of-sale/PointsOfSale.types';
import { IApiResponse, IPlainObject } from '@/types/interfaces';
import { IGetTransactionsApiResponse, ITransactionsOptions } from '@/services/requests/transactions/Transactions.types';

export const PointsOfSaleRequests = {

  getRecords(): Promise<IPointsOfSaleRecordsResponse> {
    return api.get('/points-of-sale');
  },

  getSpecificRecord(id: string): Promise<IGetSpecificPointsOfSaleResponse> {
    return api.get(`/points-of-sale/${id}`);
  },

  deleteSpecificRecord(id: string): Promise<IApiResponse<IPlainObject>> {
    return api.delete(`/points-of-sale/${id}`);
  },

  createPointOfSale(options: IPointsOfSaleCreate): Promise<IPointsOfSaleResponse> {
    return api.post('/points-of-sale', options);
  },

  editPointOfSale(options: IPointsOfSaleEdit, id: string): Promise<IPointsOfSaleResponse> {
    return api.patch(`/points-of-sale/${id}`, options);
  },

  getTransactionRecordByPos(options: ITransactionsOptions, id: string): Promise<IGetTransactionsApiResponse> {
    return api.post(`/points-of-sale/${id}/transactions/view`, options);
  },

};
