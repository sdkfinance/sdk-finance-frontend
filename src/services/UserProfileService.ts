import { TRole } from '@/constants/roles';
import store from '@/store';
import { User } from '@/services/User';

class UserProfileService extends User {

  public get role(): TRole {
    return store.getters['UserProfile/role'];
  }

}

export const UserProfileInstance = new UserProfileService();
