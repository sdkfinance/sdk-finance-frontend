import { api } from '../../api';
import type { IApiResponse } from '../../types/ApiResponse.interface';
import type { ICreateCurrency, ICurrencyResponse, IUpdateCurrency, TSetMainCurrencyApiResponse } from './Currency.types';
import type { TViewCurrenciesRequestPayload } from './Currency.types';
import type { TViewCurrenciesApiResponse } from './Currency.types';

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

  setMainCurrency(currencyId: string): Promise<TSetMainCurrencyApiResponse> {
    return api.patch(`/currencies/${currencyId}/set-main`);
  },

  viewCurrencies(payload: TViewCurrenciesRequestPayload): Promise<TViewCurrenciesApiResponse> {
    return api.post('/currencies/view', payload);
  },
};
