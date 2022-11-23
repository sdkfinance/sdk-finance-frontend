import { NavigationGuardNext, Route } from 'vue-router';
import { StoreOptions } from 'vuex';

import { IPlainObject } from '@/types/interfaces';

export interface IRouteMiddlewareContext {
  to: Route;
  from: Route;
  next: NavigationGuardNext;
  abort: NavigationGuardNext;
  store: StoreOptions<IPlainObject>;
}

export type routeMiddleware = (context: IRouteMiddlewareContext) => void;
