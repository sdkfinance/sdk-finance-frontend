import { TCommissionValue } from '@/services/requests/contracts/Commissions.types';

export function renderCommission(this: any, value: TCommissionValue, currency: string) {
  if ('valuePercent' in value && 'valueFixed' in value) {
    return `${value.valuePercent}% ${this.$t('table.label.and')} ${value.valueFixed} ${currency}`;
  }
  if ('valuePercent' in value) {
    return `${value.valuePercent}%`;
  }
  if ('valueFixed' in value) {
    return `${value.valueFixed} ${currency}`;
  }

  return '0';
}
