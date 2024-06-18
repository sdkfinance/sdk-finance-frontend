import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type { IVariableResponse } from './Variable.types';

const { api } = apiConfigInstance;
export const VariablesRequests = {
  getVariables(): Promise<IApiResponse<IVariableResponse>> {
    return api.get('/environment-variables');
  },

  update(options: IVariableResponse): Promise<IApiResponse<any>> {
    return api.post('/environment-variables/batch-update', options);
  },
};
