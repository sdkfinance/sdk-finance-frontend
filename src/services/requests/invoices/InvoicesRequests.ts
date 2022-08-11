import api from '@/services/api';

import {
  IGetInvoicesApiResponse,
  IInvoiceCalculateCommissionOptions,
  IGetInvoiceCommission,
  IInvoiceCreateOptions,
  IInvoicesOptions,
  IGetCreatedInvoiceResponse,
  IInvoiceCoin,
  IGetCalcSpecInvoiceCommission,
  IGetPayForInvoiceResponse,
} from '@/services/requests/invoices/Invoices.types';
import { IPlainObject } from '@/types/interfaces';

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

  deleteInvoice(id: string): Promise<IPlainObject> {
    return api.delete(`/invoices/${id}`);
  },

};
