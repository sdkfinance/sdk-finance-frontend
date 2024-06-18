import type { IMetaConfig } from '@sdk5/shared/types';

export interface ITab extends IMetaConfig {
  name: string;
  value: any;
  disabled?: boolean;
  done?: boolean;
  translation: string;
}
