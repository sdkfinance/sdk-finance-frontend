import api from '@/services/api';
import { IVariableResponse } from '@/services/requests/environment-variables/Variable.types';
import { IApiResponse } from '@/types/interfaces';

export const VariablesRequests = {

  getVariables(): Promise<IApiResponse<IVariableResponse>> {
    return api.get('/environment-variables');
  },

  update(options: IVariableResponse): Promise<IApiResponse<any>> {
    return api.post('/environment-variables/batch-update', options);
  },

};
