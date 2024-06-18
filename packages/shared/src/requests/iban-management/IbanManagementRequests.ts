import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type { TIbanGenerationResponse, TIbanValidationResponse } from './IbanManagement.types';

const { api } = apiConfigInstance;
export const IbanManagementRequests = {
  validateIban(iban: string): Promise<IApiResponse<TIbanValidationResponse>> {
    return api.post(`/iban/validate`, {
      iban,
    });
  },
  generateIban(bankId: string): Promise<IApiResponse<TIbanGenerationResponse>> {
    return api.post(`/iban/${bankId}/generate`);
  },
};
