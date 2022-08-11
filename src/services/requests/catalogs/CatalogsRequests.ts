import api from '@/services/api';
import { IBankCatalogResponse, IOperationFlowApiResponse } from '@/services/requests/catalogs/Catalogs.types';
import { IApiResponse } from '@/types/interfaces';

export const CatalogsRequests = {

  getOperationFlows(): Promise<IOperationFlowApiResponse> {
    return api.get('/operation-flows');
  },

  getBankCatalog(): Promise<IApiResponse<IBankCatalogResponse>> {
    return api.get('/bank-catalog');
  },

};
