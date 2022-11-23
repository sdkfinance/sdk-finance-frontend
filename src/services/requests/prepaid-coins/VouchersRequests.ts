import api from '@/services/api';
import {
  ICalculateVoucherApiResponse,
  ICreateVoucherApiResponse,
  IGetVoucherActivatedApiResponse,
  IGetVouchersApiResponse,
  IPostVoucherApiResponse,
  IPostVoucherRedeem,
  IViewPrepaidVoucherResponse,
  IVoucherNew,
  IVouchersOptions,
} from '@/services/requests/prepaid-coins/Vouchers.interface';
import { IApiResponse } from '@/types/interfaces';

export const VouchersRequests = {

  getVouchers(options: IVouchersOptions): Promise<IGetVouchersApiResponse> {
    return api.post('/prepaid-coins/view', options);
  },

  calculateVoucher(newVoucher: IVoucherNew): Promise<IPostVoucherApiResponse> {
    return api.post('/prepaid-coins/calculate', newVoucher);
  },

  creatVoucher(newVoucher: IVoucherNew): Promise<ICreateVoucherApiResponse> {
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

  viewPrepaidVoucher(serial: string): Promise<IApiResponse<IViewPrepaidVoucherResponse>> {
    return api.get(`/prepaid-coins/${serial}/view`);
  },

  // creatTicket() {
  //   return api.post('/tickets');
  // },

};
