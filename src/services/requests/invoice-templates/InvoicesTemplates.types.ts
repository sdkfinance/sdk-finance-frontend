import { IInvoiceCreate, IInvoiceData, IInvoiceDraft } from '@/services/requests/invoices/Invoices.types';
import { IApiResponse } from '@/types/interfaces';

export interface IInvoiceTemplatesRecord {
    id: string;
    type?: string;
    name: string;
    amount: number;
    description?: string;
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
