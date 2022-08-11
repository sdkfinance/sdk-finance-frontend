import store from '@/store';
import { TRole } from '@/constants/roles';
import { User } from '@/services/User';

class UserService extends User {

  public get role(): TRole {
    return store.getters['UserData/role'];
  }

  public get organizationId(): string {
    return store.getters['Profile/organizationId'];
  }

}

export const UserInstance = new UserService();
