import { Store } from 'vuex';
import {
  Action,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

import router from '@/router';
import { LocalStorageService } from '@/services/LocalStorageService';
import { AuthRequests } from '@/services/requests';
import { ILogin, ILoginConfirm } from '@/services/requests/auth/Auth.types';

interface AuthData {
  token: {
    expiresAt: string;
    token: string;
  };
  user: {
    id: string | number;
    name: string;
  };
  organization: {
    type: string;
    id: string | number;
  };
  role: string;
}

export interface IUserData {
  token: string | null;
  tokenExpiration: string | null;
  role: string | null;
}

@Module({
  namespaced: true, name: 'UserData', store: {} as Store<any>,
})
export class UserData extends VuexModule {

  public userData: IUserData = {
    token: LocalStorageService.get('token'),
    tokenExpiration: LocalStorageService.get('tokenExpiration'),
    role: LocalStorageService.get('role'),
  };

  public get token(): string | null {
    return this.userData.token;
  }

  public get role(): string {
    return this.userData.role || '';
  }

  @Mutation
  public SET_USER_DATA(data: AuthData): void {
    const { role } = data;
    const { token, expiresAt } = data.token;

    LocalStorageService.set('token', token);
    LocalStorageService.set('role', role);
    LocalStorageService.set('tokenExpiration', expiresAt);

    this.userData = {
      token,
      tokenExpiration: expiresAt,
      role,
    };
  }

  @Mutation
  public RESET(): void {
    LocalStorageService.removeAll();
    this.userData = {
      token: null,
      tokenExpiration: null,
      role: null,
    };
  }

  @Action
  public async login(params: ILogin) {
    const { login, password } = params;

    const { response, error } = await AuthRequests.authorization({
      login: login.toLowerCase(),
      password,
    });

    if (response && response.action !== 'OTP_SENT') {
      const [data] = response.members;
      this.context.commit('SET_USER_DATA', data);
    }

    return { response, error };
  }

  @Action
  public async loginConfirm(params: ILoginConfirm) {
    const { login, otp } = params;

    const { response, error } = await AuthRequests.authorizationConfirm({
      login: login.toLowerCase(),
      otp,
    });

    if (response) {
      const [data] = response.members;
      this.context.commit('SET_USER_DATA', data);
    }

    return { response, error };
  }

  @Action({ rawError: true })
  public logout(): void {
    this.context.commit('UserCoins/RESET_USER_COINS_DATA', null, { root: true });
    this.context.commit('RESET', null);
    router.push({ name: 'entrance' }).catch(() => {});
  }

}
