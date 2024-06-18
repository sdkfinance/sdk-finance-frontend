import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IGetCalcSpecInvoiceCommission,
  IGetCreatedInvoiceResponse,
  IGetInvoiceCommission,
  IGetInvoicesApiResponse,
  IGetPayForInvoiceResponse,
  IInvoiceCalculateCommissionOptions,
  IInvoiceCoin,
  IInvoiceCreateOptions,
  IInvoicesOptions,
} from './Invoices.types';

const { api } = apiConfigInstance;

export const InvoicesRequests = {
  createInvoice(options: IInvoiceCreateOptions): Promise<IGetCreatedInvoiceResponse> {
    return api.post('/invoices', options);
  },

  getRecords(options: IInvoicesOptions): Promise<IGetInvoicesApiResponse> {
    return api.post('/invoices/view', options);
  },

  calcInvoiceCommissionAsMerch(options: IInvoiceCalculateCommissionOptions): Promise<IGetInvoiceCommission> {
    return api.post('/invoices/calculate', options);
  },

  calcCommissionForSpecifiedInvoice(options: IInvoiceCoin, identifier: string): Promise<IGetCalcSpecInvoiceCommission> {
    return api.post(`/invoices/${identifier}/calculate`, options);
  },

  payForInvoice(options: IInvoiceCoin, identifier: string): Promise<IGetPayForInvoiceResponse> {
    return api.post(`/invoices/${identifier}/pay`, options);
  },

  deleteInvoice(id: string): Promise<IApiResponse<any>> {
    return api.delete(`/invoices/${id}`);
  },
};
