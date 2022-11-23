import { Store } from 'vuex';
import {
  Action,
  Module, Mutation, VuexModule,
} from 'vuex-module-decorators';

import { LocalStorageService } from '@/services/LocalStorageService';
import { ProfileRequests } from '@/services/requests';
import { IUserInfo, IUserLogin, IUserSecurity } from '@/services/requests/profiles/UserProfile.types';
import { IApiResponse, IPlainObject, IProfile } from '@/types/interfaces';

@Module({ namespaced: true, name: 'Profile', store: {} as Store<any> })
export class Profile extends VuexModule {

  public profileData: IProfile = {};

  public memberShipsData: IPlainObject[] = [];

  public isProfileLoaded: boolean = false;

  public get profile(): object {
    return this.profileData || {};
  }

  public get personInfo(): IUserInfo {
    return this.context.getters.profile.person;
  }

  public get personContacts(): IUserLogin {
    return this.context.getters.profile.contact;
  }

  public get namePlain(): IPlainObject {
    const { person } = this.context.getters.profile || {};
    const { namePlain } = person || {};

    return namePlain || {};
  }

  public get personName(): string {
    const { first } = this.context.getters.namePlain || {};
    const userName = LocalStorageService.get('userName');

    return first || userName || '';
  }

  public get personEmail(): string {
    const { contact } = this.context.getters.profile || {};
    const { email } = contact || {};

    return email || '';
  }

  public get organizationId(): number|undefined {
    return this.memberShipsData?.[0]?.organizationId;
  }

  public get role(): boolean {
    return this.memberShipsData?.[0]?.roleName;
  }

  @Mutation
  public SET_LOADED_FLAG(isProfileLoaded: boolean = true): void {
    this.isProfileLoaded = isProfileLoaded;
  }

  @Mutation
  public SET_PROFILE(profile: IProfile): void {
    this.profileData = profile;
  }

  @Mutation
  public SET_MEMBERSHIPS(memberShips: IPlainObject[]): void {
    this.memberShipsData = memberShips;
  }

  @Mutation
  public RESET(): void {
    this.profileData = {};
    this.isProfileLoaded = false;
  }

  @Action
  public async getProfile(): Promise<object> {
    const { response, error } = await ProfileRequests.getProfile();
    const { profile, memberShips } = response || {};

    this.context.commit('SET_PROFILE', profile);
    this.context.commit('SET_MEMBERSHIPS', memberShips);

    this.context.commit('SET_LOADED_FLAG');

    return { response, error };
  }

  @Action
  public async updatePerson(options: { person: IUserInfo }): Promise<IApiResponse<any>> {
    const { response, error } = await ProfileRequests.updatePersonInformation(options);

    const { profile } = response || {};

    if (!error) {
      this.context.commit('SET_PROFILE', profile);

      this.context.commit('SET_LOADED_FLAG');
    }

    return { response, error };
  }

  @Action
  public async updateTwoFactorAuth(options: IUserSecurity): Promise<IApiResponse<any>> {
    const { response, error } = await ProfileRequests.updateMySecurity(options);

    const { profile } = response || {};

    if (!error) {
      this.context.commit('SET_PROFILE', profile);

      this.context.commit('SET_LOADED_FLAG');
    }

    return { response, error };
  }

}
