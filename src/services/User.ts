import { ROLES, TRole } from '@/constants/roles';
import store from '@/store';

export class User {

  public get role(): TRole {
    return store.getters['UserData/role'];
  }

  public get isRole(): { [key: string]: boolean } {
    return Object.keys(ROLES).reduce((acc, role) => ({ ...acc, [role]: role === this.role }), {});
  }

  public hasAnyRoles(roles: TRole[]): boolean {
    return roles.some((role) => role === this.role);
  }

  public hasNoRoles(roles: TRole[]): boolean {
    return !roles.includes(this.role);
  }

}
