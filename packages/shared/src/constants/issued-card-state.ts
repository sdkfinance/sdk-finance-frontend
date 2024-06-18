import type { TUserCardState } from '../requests/issue-card/IssueCardRequests.types';

type TIssuedCardRecord = {
  [K in TUserCardState]: K;
};
export const ISSUED_CARD_STATE: TIssuedCardRecord = {
  ACTIVE: 'ACTIVE',
  LIMITED: 'LIMITED',
  SUSPENDED: 'SUSPENDED',
  TERMINATED: 'TERMINATED',
  UNACTIVATED: 'UNACTIVATED',
  UNSUPPORTED: 'UNSUPPORTED',
};
