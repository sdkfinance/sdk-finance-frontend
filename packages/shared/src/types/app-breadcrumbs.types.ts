import type { Dictionary, Route, RouteRecord } from 'vue-router/types/router';

export type TAppBreadcrumb = {
  name: string;
  routerLinkName?: string;
  label: string;
  params?: Dictionary<string>;
  completed?: boolean;
  route?: RouteRecord;
  query?: Route['query'];
};
