import apiConfig from '../../api';
import type { IApiResponse } from '../../types';
import type { IBankCatalogResponse, IOperationFlowApiResponse } from './Catalogs.types';

export const CatalogsRequests = {
  getOperationFlows(): Promise<IOperationFlowApiResponse> {
    return apiConfig.api.get('/operation-flows');
  },

  getBankCatalog(): Promise<IApiResponse<IBankCatalogResponse>> {
    return apiConfig.api.get('/bank-catalog');
  },
};
