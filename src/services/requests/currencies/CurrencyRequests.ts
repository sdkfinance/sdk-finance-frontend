import api from '@/services/api';
import { ICurrency, ICurrencyResponse } from '@/services/requests/currencies/Currency.types';
import { IApiResponse } from '@/types/interfaces';

export const CurrencyRequests = {

  getCurrencies(): Promise<IApiResponse<ICurrencyResponse>> {
    return api.get('/currencies');
  },

  create(options: ICurrency): Promise<IApiResponse<any>> {
    return api.post('/currencies', options);
  },
};
