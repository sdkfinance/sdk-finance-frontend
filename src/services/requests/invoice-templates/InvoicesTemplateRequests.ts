import api from '@/services/api';

import {
  IGetInvoiceTemplatesApiResponse,
  IInvoiceTemplateOptions,
} from '@/services/requests/invoice-templates/InvoicesTemplates.types';
import { IApiResponse } from '@/types/interfaces';

export const InvoicesTemplatesRequests = {

  fetchRecords(): Promise<IGetInvoiceTemplatesApiResponse> {
    return api.post('/invoice-templates/view', {});
  },

  createRecord(options: IInvoiceTemplateOptions): Promise<IApiResponse<any>> {
    return api.post('/invoice-templates', options);
  },

  updateRecord(id: string, options: IInvoiceTemplateOptions): Promise<IApiResponse<any>> {
    return api.patch(`/invoice-templates/${id}`, options);
  },

  deleteRecord(id: string): Promise<IApiResponse<any>> {
    return api.delete(`/invoice-templates/${id}`);
  },

};
