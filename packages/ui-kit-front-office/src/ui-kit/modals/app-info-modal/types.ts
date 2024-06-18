import type { InfoModalTypes } from './constants';

export type TModalTypes = keyof typeof InfoModalTypes;

export interface TModalType {
  icon: string;
}
