import type { Store } from 'vuex';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { UserInfoRequests } from '../requests';
import type { IUserProfile } from '../types';

@Module({ namespaced: true, name: 'UserProfile', store: {} as Store<any> })
export class UserProfile extends VuexModule {
  public userProfileData: IUserProfile = {};

  public get identificationStatus(): string {
    return this.userProfileData?.status || '';
  }

  public get role(): string {
    return this.userProfileData?.role?.[0]?.code || '';
  }

  public get type(): string {
    return this.userProfileData?.type || '';
  }

  public get userNameString() {
    const { person } = this.userProfileData;
    const { namePlain } = person || {};

    if (!namePlain) {
      return '';
    }

    const { first, last } = namePlain;

    return `${first} ${last}`;
  }

  @Mutation
  public SET_USER_PROFILE(profile: IUserProfile): void {
    this.userProfileData = profile;
  }

  @Action({ rawError: true })
  public async getProfile(id: string): Promise<any> {
    const { response, error } = await UserInfoRequests.getUserProfile(id);
    const { profile } = response || {};

    this.context.commit('SET_USER_PROFILE', profile);

    return { response, error };
  }
}
