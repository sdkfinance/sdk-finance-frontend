import { cloneDeep } from 'lodash';

import type { IRouteConfig } from '../types';

export const generateNestedRoutes = (prefix: string, path: string, routes: IRouteConfig[], meta: any = {}, props: any = {}): IRouteConfig[] =>
  cloneDeep(routes).map((route: IRouteConfig) => {
    route.path = `${path}/${route.path}`;
    route.name = `${prefix}-${route.name}`;

    if (typeof route.props === 'object') {
      route.props = { ...route.props, ...props };
    } else {
      route.props = props;
    }

    route.meta = { ...route.meta, ...meta };
    return route;
  });
