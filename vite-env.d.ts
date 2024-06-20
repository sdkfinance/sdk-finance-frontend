/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_DEMO_MODE: string;
  readonly VUE_APP_CREATE_ISSUER_NOT_ALLOWED: boolean;
  readonly VUE_APP_CREATE_CURRENCY_NOT_ALLOWED: string;
  readonly VUE_APP_GOOGLE_MAP_API_KEY: string;
  readonly VUE_APP_API_VERSION: string;
  readonly BACKEND_HOST: string;
  readonly LEGACY_BUILD: string;
  readonly VUE_APP_FRONT_OFFICE_ROUTES: string | undefined;
  readonly VUE_APP_BACK_OFFICE_ROUTES: string | undefined;
  readonly VUE_APP_PHONE_VALIDATION_PATTERN: string;
  readonly VUE_APP_CUSTOM_SERIAL_VALIDATION_PATTERN: string;
  readonly VUE_APP_CUSTOM_SERIAL_VALIDATION_ENABLED: string;
  readonly VUE_APP_INIT_GOOGLE_TAG: string | undefined;
  readonly VUE_APP_GOOGLE_TAG_ID: string | undefined;
  readonly VUE_APP_TRANSACTIONS_MAP_ENABLED: string;
  readonly VUE_APP_CREATE_WALLET_CUSTOM_SERIAL_INPUT_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_TRANSFER_TO_CARD_ACTION_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_TRANSFER_TO_ACCOUNT_ACTION_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_MOBILE_TOP_UP_ACTION_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_OTHER_PAYMENTS_ACTION_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_EXCHANGE_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_CURRENCY_RATES_VISIBLE: string | undefined;
  readonly VUE_APP_ENABLE_BUSINESS_OPERATIONS_KYC_RESTRICTIONS: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_TOP_UP_REGULAR_BANK_TRANSFER_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_TOP_UP_ALWAYS_ENABLE_CARD_TOKENIZATION: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_WITHDRAWAL_REGULAR_BANK_TRANSFER_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_KYC_CHECK_NOTIFICATION_ENABLED: string | undefined;
  readonly VUE_APP_HEADER_BACK_LINK_VISIBLE: string | undefined;
  readonly VUE_APP_FOOTER_LINKS_VISIBLE: string | undefined;
  readonly VUE_APP_FOOTER_COPYRIGHTS_VISIBLE: string | undefined;
  readonly VUE_APP_MANUAL_GUIDE_LINK_VISIBLE: string | undefined;
  readonly VUE_APP_API_LIST_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_SWAGGER_URL: string | undefined;
  readonly VUE_APP_BRAND_LOGO_L_URL: string | undefined;
  readonly VUE_APP_BRAND_LOGO_M_URL: string | undefined;
  readonly VUE_APP_PRIMARY_COLOR: string | undefined;
  readonly VUE_APP_PRIMARY_HOVER: string | undefined;
  readonly VUE_APP_AVAILABLE_ROLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CLIENTS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CLIENTS_KYC_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_ROLES_TEAM_MEMBERS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_ROLES_TRUSTED_DOMAINS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_ROLES_ROLES_AND_PERMISSIONS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_INVESTIGATIONS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_ASSETS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_ASSET_RATES_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_SYSTEM_ACCOUNTS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_CASHIER_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_CASH_DESK_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_RECONCILIATION_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_OPERATIONAL_DAYS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CFO_SYSTEM_CALENDAR_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CRO_VENDORS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_BACK_OFFICE_CRO_CONTRACTS_PAGE_VISIBLE: string | undefined;
  readonly VUE_APP_USER_DASHBOARD_WITHDRAWAL_DEBIT_CARD_ADD_CARD_ACTION_VISIBLE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
