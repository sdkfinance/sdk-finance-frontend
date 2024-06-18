import type { IInvoiceCreate, IInvoiceData, IInvoiceDraft } from '@sdk5/shared/requests';
import type { IApiResponse } from '@sdk5/shared/types';

export interface IInvoiceTemplatesRecord {
  id: string;
  type?: string;
  name: string;
  amount: number;
  description?: string;
  invoiceName?: string;
  reusable: boolean;
  regular: boolean;
  templateName: string;
  payerContact: string;
  recipientCoin: string;
  data: IInvoiceData;
  createdAt: string;
  expiresAt: string;
}

interface IInvoiceTemplatesResponse {
  records: IInvoiceTemplatesRecord[] | [];
}

export type IInvoiceTemplateUpdate = Omit<IInvoiceCreate, 'createTemplateName'>;

export interface IInvoiceTemplateOptions {
  name: string;
  invoiceIdentifier?: string;
  invoiceDraft?: IInvoiceDraft;
}

export type IGetInvoiceTemplatesApiResponse = IApiResponse<IInvoiceTemplatesResponse>;
