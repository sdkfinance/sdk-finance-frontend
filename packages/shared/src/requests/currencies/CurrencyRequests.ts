import { api } from '../../api';
import type { IApiResponse } from '../../types/ApiResponse.interface';
import type { ICreateCurrency, ICurrencyResponse, IUpdateCurrency } from './Currency.types';

export const CurrencyRequests = {
  getCurrencies(): Promise<IApiResponse<ICurrencyResponse>> {
    return api.get('/currencies');
  },

  create(options: ICreateCurrency): Promise<IApiResponse<any>> {
    return api.post('/currencies', options);
  },

  update(currencyId: string, data: IUpdateCurrency): Promise<IApiResponse<any>> {
    return api.patch(`/currencies/${currencyId}`, data);
  },
};
