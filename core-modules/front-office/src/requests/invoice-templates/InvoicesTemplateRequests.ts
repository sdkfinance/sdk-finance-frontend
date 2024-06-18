import apiConfigInstance from '@sdk5/shared/api';
import type { IApiResponse } from '@sdk5/shared/types';

import type { IGetInvoiceTemplatesApiResponse, IInvoiceTemplateOptions } from './InvoicesTemplates.types';

const { api } = apiConfigInstance;
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
