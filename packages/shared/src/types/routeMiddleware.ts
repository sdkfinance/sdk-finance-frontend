import type { NavigationGuardNext, Route } from 'vue-router';
import type { StoreOptions } from 'vuex';

type IPlainObject = Record<string, any>;
export interface IRouteMiddlewareContext {
  to: Route;
  from: Route;
  next: NavigationGuardNext;
  abort: NavigationGuardNext;
  store: StoreOptions<IPlainObject>;
}

export type RouteMiddleware = (context: IRouteMiddlewareContext) => void;
