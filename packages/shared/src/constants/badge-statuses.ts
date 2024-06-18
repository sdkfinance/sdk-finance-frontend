export const BADGE_STATUSES = {
  banned: 'banned',
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
  paid: 'paid',
  expired: 'expired',
  new: 'new',
  rejected: 'rejected',
  default: 'new',
  processed: 'done',
  authorized: 'authorized',
  approved: 'approved',
  declined: 'declined',
  activated: 'activated',
  stopped: 'stopped',
  deactivate: 'deactivate',
  deactivated: 'deactivated',
  done: 'processed',
  none: 'none',
  error: 'error',
  suspended: 'suspended',
  terminated: 'terminated',
  unsupported: 'unsupported',
  unactivated: 'unactivated',
  limited: 'limited',
  cancelled: 'cancelled',
  created: 'created',
  notstarted: 'notstarted',
  warning: 'warning',
  inprogress: 'inprogress',
  reconciled: 'reconciled',
  fileinprogress: 'fileinprogress',
  resolved: 'resolved',
  notresolved: 'notresolved',
  underinvestigation: 'underinvestigation',
  in_progress: 'in_progress',
  kyc_verified: 'kyc_verified',
  in_verification: 'in_verification',
  outdated: 'outdated',
  review_required: 'review_required',
  closed: 'closed',
  opened: 'opened',
  feature: 'feature',
};

export type TBadgeStatus = keyof typeof BADGE_STATUSES;
