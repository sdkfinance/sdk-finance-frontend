import { IPaymentProviderRecord } from '@/services/requests/gate/Gate.types';

export interface IWithdrawalCommissionBlock {
    amountToSend: number;
    currency: string;
    commissionAmount: number;
}

export interface IWithdrawalForm {
    method: string | null;
    cashDeskId: string | null;
    receiverName: string | null;
    accountMethod: IPaymentProviderRecord | null;
    coin: string;
    name: string | null;
    amount: number | null;
    bankAccountNumber: string | null;
    address: string | null;
    bic: string | null;
    fullName: string | null;
    iban: string | null;
    swift: string | null;
    txType: 'REDEEM';
}

export interface IWithdrawalSuccessData {
    amount: number;
    serial: string;
    currency: string;
    providerName?: string;
    requestIdentifier?: number;
}

export type TWithdrawalFormResetFields = keyof Omit<IWithdrawalForm, 'txType' | 'coin'>
