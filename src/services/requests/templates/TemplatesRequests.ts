import api from '@/services/api';
import { IApiResponse } from '@/types/interfaces';
import {
  IGetTransferTemplateApiResponse,
  ITransferTemplateBody,
  ITransferTemplateBodyByOperationId,
  ITransferTemplateExecuteResponse,
  ITransferTemplateOptions,
  ITransferTemplateResponse,
  ITransferTemplateSingleResponse,
} from '@/services/requests/templates/Templates.types';
import { ITransferCalculateResponse } from '@/services/requests/transfers/Transfers.types';

export const TemplatesRequests = {

  getTemplateTransfers(): Promise<IGetTransferTemplateApiResponse> {
    return api.get('/templates/transfer');
  },

  getTemplateFilteredTransfers(payload: ITransferTemplateOptions): Promise<IApiResponse<ITransferTemplateResponse>> {
    return api.post('/templates/transfer/view', payload);
  },

  createTemplateTransfer(data: ITransferTemplateBody): Promise<IApiResponse<ITransferTemplateSingleResponse>> {
    return api.post('/templates/transfer', data);
  },

  createTemplateTransferByOperationId(businessProcessId: string, data: ITransferTemplateBodyByOperationId):
      Promise<IApiResponse<ITransferTemplateSingleResponse>> {
    return api.post(`/templates/transfer/operation/${businessProcessId}`, data);
  },

  updateTemplateTransfer(id: string, data: ITransferTemplateBody): Promise<IApiResponse<ITransferTemplateSingleResponse>> {
    return api.patch(`/templates/transfer/${id}`, data);
  },

  deleteTemplateTransfer(id: string): Promise<IApiResponse<ITransferTemplateSingleResponse>> {
    return api.delete(`/templates/transfer/${id}`);
  },

  calculateCommissionFee(id: string, amount: string|number): Promise<IApiResponse<ITransferCalculateResponse>> {
    return api.post(`/templates/transfer/${id}/calculate`, { amount });
  },

  executeTransfer(id: string, amount: string|number): Promise<ITransferTemplateExecuteResponse> {
    return api.post(`/templates/transfer/${id}/execute`, { amount });
  },
};
