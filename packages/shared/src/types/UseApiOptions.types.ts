import type { MaybeRef } from './maybeRef';

export type TCommonUseApiOptions = {
  showErrorNotification?: boolean;
};
export interface ICommonUseQueryOptions extends TCommonUseApiOptions {
  queryEnabled?: MaybeRef<boolean>;
}

export type TUseMutationsApiCommonOptions = TCommonUseApiOptions & {
  invalidateQueriesOnSuccess?: boolean;
  showSuccessNotification?: boolean;
};
