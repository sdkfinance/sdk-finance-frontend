export type TFixedMenuLink = {
  to: string;
  tooltip: string;
  icon: string;
};
export type TFixedMenuAction = Pick<TFixedMenuLink, 'tooltip' | 'icon'> & {
  actionFn: (...args: any[]) => void;
};
