export type TTopUpMethod = 'provider' | 'bank' | null;

export interface ITopUpOption {
  value: TTopUpMethod;
  label: string;
}

export const TOP_UP_METHODS: ITopUpOption[] = [
  { value: 'provider', label: 'pages.top_up.provider' },
  { value: 'bank', label: 'pages.top_up.bank' },
];
