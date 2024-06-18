import apiConfigInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  ICalculateVoucherApiResponse,
  ICreateVoucherApiResponse,
  IGetVoucherActivatedApiResponse,
  IGetVouchersApiResponse,
  IPostVoucherApiResponse,
  IPostVoucherRedeem,
  IPrepaidVoucherRecord,
  IVoucherNew,
  IVouchersOptions,
} from './Vouchers.interface';

const { api } = apiConfigInstance;
export const VouchersRequests = {
  getVouchers(options: IVouchersOptions): Promise<IGetVouchersApiResponse> {
    return api.post('/prepaid-coins/view', options);
  },

  calculateVoucher(newVoucher: IVoucherNew): Promise<IPostVoucherApiResponse> {
    return api.post('/prepaid-coins/calculate', newVoucher);
  },

  createVoucher(newVoucher: IVoucherNew): Promise<ICreateVoucherApiResponse> {
    return api.post('/prepaid-coins', newVoucher);
  },

  calculateVoucherRedeemCommission(voucherRedeem: IPostVoucherRedeem, serial: string): Promise<ICalculateVoucherApiResponse> {
    return api.post(`/prepaid-coins/${serial}/calculate`, voucherRedeem);
  },

  redeemVoucher(voucherRedeem: IPostVoucherRedeem, serial: string): Promise<IGetVoucherActivatedApiResponse> {
    return api.post(`/prepaid-coins/${serial}/activate`, voucherRedeem);
  },

  recoveryPin(serial: string): Promise<IApiResponse<any>> {
    return api.post(`prepaid-coins/${serial}/change-pin`);
  },

  viewPrepaidVoucher(serial: string): Promise<IApiResponse<IPrepaidVoucherRecord>> {
    return api.get(`/prepaid-coins/${serial}/view`);
  },
};
