export const PROFILE_DOCUMENT_STATUS = {
  pending: 'PENDING',
  approved: 'APPROVED',
  declined: 'DECLINED',
  outdated: 'OUTDATED',
  review_required: 'REVIEW_REQUIRED',
  in_verification: 'IN_VERIFICATION',
} as const;

export const PROFILE_FILE_TYPES = {
  passport: 'passport',
  tax_id: 'tax_id',
  drive_license: 'drive_license',
  other: 'other',
  poa: 'poa',
  selfie: 'selfie',
} as const;

export type TProfileDocumentType = (typeof PROFILE_FILE_TYPES)[keyof typeof PROFILE_FILE_TYPES];
export type TProfileDocumentStatus = (typeof PROFILE_DOCUMENT_STATUS)[keyof typeof PROFILE_DOCUMENT_STATUS];
