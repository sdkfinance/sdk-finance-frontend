export const ISSUED_CARD_TRANSITION_REASON_CODE = {
  OBJECT_ACTIVATED_FOR_THE_FIRST_TIME: '00',
  REQUESTED_BY_YOU: '01',
  INACTIVITY_OVER_TIME: '02',
  THIS_ADDRESS_CANNOT_ACCEPT_MAIL_OR_THE_ADDRESSEE_IS_UNKNOWN: '03',
  NEGATIVE_ACCOUNT_BALANCE: '04',
  ACCOUNT_UNDER_REVIEW: '05',
  SUSPICIOUS_ACTIVITY_WAS_IDENTIFIED: '06',
  ACTIVITY_OUTSIDE_THE_PROGRAM_PARAMETERS_WAS_IDENTIFIED: '07',
  CONFIRMED_FRAUD_WAS_IDENTIFIED: '08',
  MATCHED_WITH_AN_OFFICE_OF_FOREIGN_ASSETS_CONTROL_LIST: '09',
  CARD_WAS_REPORTED_LOST: '10',
  CARD_INFORMATION_WAS_CLONED: '11',
  ACCOUNT_OR_CARD_INFORMATION_WAS_COMPROMISED: '12',
  TEMPORARY_STATUS_CHANGE_WHILE_ON_HOLD_LEAVE: '13',
  INITIATED_BY_MARQETA: '14',
  INITIATED_BY_ISSUER: '15',
  CARD_EXPIRED: '16',
  FAILED_KYC: '17',
  CHANGED_TO_ACTIVE_BECAUSE_INFORMATION_WAS_PROPERLY_VALIDATED: '18',
  CHANGED_TO_ACTIVE_BECAUSE_ACCOUNT_ACTIVITY_WAS_PROPERLY_VALIDATED: '19',
  CHANGE_OCCURRED_PRIOR_TO_THE_NORMALIZATION_OF_REASON_CODES: '20',
  INITIATED_BY_A_THIRD_PARTY_OFTEN_A_DIGITAL_WALLET_PROVIDER: '21',
  PIN_RETRY_LIMIT_REACHED: '22',
  CARD_WAS_REPORTED_STOLEN: '23',
  ADDRESS_ISSUE: '24',
  NAME_ISSUE: '25',
  SSN_ISSUE: '26',
  DOB_ISSUE: '27',
  EMAIL_ISSUE: '28',
  PHONE_ISSUE: '29',
  ACCOUNT_FULFILLMENT_MISMATCH: '30',
  OTHER_REASON: '31',
} as const;

export type TIssuedCardTransitionReasonCode = (typeof ISSUED_CARD_TRANSITION_REASON_CODE)[keyof typeof ISSUED_CARD_TRANSITION_REASON_CODE];
