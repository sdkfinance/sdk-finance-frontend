import { Route } from 'vue-router';

import { CONTRACTS_CHILDREN } from '@/modules/contracts-old/routes';
import { IRouteConfig } from '@/types/interfaces';

export const getContractChildrenRoutesByLevel = (currentRoute: Route, level: number, links: IRouteConfig[] = CONTRACTS_CHILDREN) => {
  const parentRouteName: string = currentRoute.name?.split('-')[0] || '';

  return links.filter(({ name, meta }) => (
    meta?.level === level && name?.indexOf(parentRouteName) === 0));
};
