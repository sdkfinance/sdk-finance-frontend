export const EXPORT_STATUSES = {
  COMPLETE: 'COMPLETE',
  PENDING: 'PENDING',
  NOT_FOUND: 'NOT_FOUND',
};

export type TExportStatuses = keyof typeof EXPORT_STATUSES;
