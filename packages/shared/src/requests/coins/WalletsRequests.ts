import { api } from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IGetWalletsApiResponse,
  IValidateWalletResponse,
  IWalletBody,
  IWalletDeactivatePayload,
  IWalletGetByLoginPayload,
  IWalletGetByLoginResponse,
  IWalletRecord,
} from './Wallets.types';

export const WalletsRequests = {
  getWallets(): Promise<IGetWalletsApiResponse> {
    return api.get('/coins');
  },

  createWallet(data: IWalletBody): Promise<IApiResponse<IWalletRecord>> {
    return api.post('/coins', data);
  },

  updateWallet(payload: { name: string; active?: boolean; serial: string }): Promise<IApiResponse<IWalletRecord>> {
    const { serial, ...updatePayload } = payload;
    return api.patch(`/coins/${serial}`, updatePayload);
  },

  updateWalletStatus(serial: string, payload: IWalletDeactivatePayload): Promise<IApiResponse<IWalletRecord>> {
    return api.patch(`/coins/${serial}/status`, payload);
  },

  deleteWallet(serial: string): Promise<IApiResponse<IWalletRecord>> {
    return api.delete(`/coins/${serial}`);
  },

  validateWallet(serial: string): Promise<IApiResponse<IValidateWalletResponse>> {
    return api.post('/coins/validate', { serial });
  },

  getWalletByLogin(payload: IWalletGetByLoginPayload): Promise<IApiResponse<IWalletGetByLoginResponse>> {
    return api.post('/coins/serial', payload);
  },

  closeAndTransfer(serial: string, transferToCoinSerial: string): Promise<IApiResponse<void>> {
    return api.put(`/close/coin/${serial}`, { transferToCoinSerial });
  },
};
