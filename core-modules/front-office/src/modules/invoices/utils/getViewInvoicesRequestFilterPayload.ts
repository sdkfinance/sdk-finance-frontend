import type { IInvoicesFilter, TInvoicesFilterPayload } from '@sdk5/shared/requests';

export const getViewInvoicesRequestFilterPayload = (incomingFilter: IInvoicesFilter): TInvoicesFilterPayload => {
  const { totalPrice, currencyId, direction, name, statuses, identifier, createdByUserId } = incomingFilter;
  const filterPayload: TInvoicesFilterPayload = {
    direction,
    name,
    statuses,
    identifier,
    createdByUserId,
  };

  if (typeof totalPrice !== 'undefined' && currencyId) {
    filterPayload.totalPrice = { currencyId, amount: Number(totalPrice) };
  }

  return filterPayload;
};
