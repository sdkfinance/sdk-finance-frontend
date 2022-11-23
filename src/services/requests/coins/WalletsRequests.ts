import api from '@/services/api';
import {
  IGetWalletsApiResponse,
  IValidateWalletResponse,
  IWalletBody, IWalletGetByLoginPayload, IWalletGetByLoginResponse,
  IWalletRecord,
} from '@/services/requests/coins/Wallets.types';
import { IApiResponse } from '@/types/interfaces';

export const WalletsRequests = {

  getWallets(): Promise<IGetWalletsApiResponse> {
    return api.get('/coins');
  },

  createWallet(data: IWalletBody): Promise<IApiResponse<IWalletRecord>> {
    return api.post('/coins', data);
  },

  updateWallet(serial: string, payload: { name: string; active?: boolean }): Promise<IApiResponse<IWalletRecord>> {
    return api.patch(`/coins/${serial}`, payload);
  },

  updateWalletStatus(serial: string): Promise<IApiResponse<IWalletRecord>> {
    return api.patch(`/coins/${serial}/status`);
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
