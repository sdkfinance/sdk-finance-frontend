import type { Store } from 'vuex';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import type { TRole } from '../constants';
import type { IAuthorizedMember, ILogin, ILoginConfirm } from '../requests/auth';
import { AuthRequests } from '../requests/auth';
import router from '../router';
import { LocalStorageService } from '../services/LocalStorageService';

export interface IUserData {
  token: string | null;
  tokenExpiration: string | null;
  role: TRole | null;
}

@Module({
  namespaced: true,
  name: 'UserData',
  store: {} as Store<any>,
})
export class UserData extends VuexModule {
  public userData: IUserData = {
    token: LocalStorageService.get('token'),
    tokenExpiration: LocalStorageService.get('tokenExpiration'),
    role: LocalStorageService.get('role') as TRole | null,
  };

  public get token(): string | null {
    return this.userData.token;
  }

  public get role(): TRole {
    return this.userData.role || ('' as TRole);
  }

  @Mutation
  public SET_USER_DATA(data: IAuthorizedMember): void {
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
    LocalStorageService.removeAuthRelatedFields();
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

    if (response && response.action !== 'OTP_SENT') {
      const [data] = response.members;
      this.context.commit('SET_USER_DATA', data);
    }

    return { response, error };
  }

  @Action({ rawError: true })
  public async logout() {
    await router.push({ name: 'entrance' }).catch((error) => {
      console.error('router push error during layout --> ', error);
      window.location.reload();
    });
    this.context.commit('UserCoins/RESET_USER_COINS_DATA', null, { root: true });
    this.context.commit('RESET', null);
  }

  @Action
  public resetAuthData() {
    this.context.commit('RESET');
  }
}
