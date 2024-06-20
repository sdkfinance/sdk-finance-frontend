import { api } from '../../api';
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
  TGetQrInvoiceInfoResponse,
} from './Invoices.types';

export const InvoicesRequests = {
  createInvoice(options: IInvoiceCreateOptions): Promise<IGetCreatedInvoiceResponse> {
    const { sendPaymentLink, ...createPayload } = options;
    return api.post(`/invoices?sendPaymentLink=${!!sendPaymentLink}`, createPayload);
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

  getQrInvoiceInfo(identifier: string): Promise<TGetQrInvoiceInfoResponse> {
    return api.get(`/qr/invoices/${identifier}`);
  },
};
