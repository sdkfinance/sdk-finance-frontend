const createWalletCustomSerialInputVisible = import.meta.env.VUE_APP_CREATE_WALLET_CUSTOM_SERIAL_INPUT_VISIBLE !== 'false';
const makePaymentTransferToAccountActionVisible = import.meta.env.VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_TRANSFER_TO_ACCOUNT_ACTION_VISIBLE !== 'false';
const makePaymentTransferToCardActionVisible = import.meta.env.VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_TRANSFER_TO_CARD_ACTION_VISIBLE !== 'false';
const makePaymentMobileTopUpActionVisible = import.meta.env.VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_MOBILE_TOP_UP_ACTION_VISIBLE !== 'false';
const makePaymentOtherPaymentsActionVisible = import.meta.env.VUE_APP_USER_DASHBOARD_MAKE_PAYMENT_OTHER_PAYMENTS_ACTION_VISIBLE !== 'false';
const userDashboardExchangeVisible = import.meta.env.VUE_APP_USER_DASHBOARD_EXCHANGE_VISIBLE !== 'false';
const userDashboardCurrencyRatesVisible = import.meta.env.VUE_APP_USER_DASHBOARD_CURRENCY_RATES_VISIBLE !== 'false';
const makePaymentOperationsVisible =
  makePaymentMobileTopUpActionVisible ||
  makePaymentOtherPaymentsActionVisible ||
  makePaymentTransferToAccountActionVisible ||
  makePaymentTransferToCardActionVisible;
const businessOperationKycRestrictionsEnabled = import.meta.env.VUE_APP_ENABLE_BUSINESS_OPERATIONS_KYC_RESTRICTIONS === 'true';
const topUpRegularBankTransferVisible = import.meta.env.VUE_APP_USER_DASHBOARD_TOP_UP_REGULAR_BANK_TRANSFER_VISIBLE !== 'false';
const topUpAlwaysEnableCardTokenization = import.meta.env.VUE_APP_USER_DASHBOARD_TOP_UP_ALWAYS_ENABLE_CARD_TOKENIZATION === 'true';
const withdrawalRegularBankTransferVisible = import.meta.env.VUE_APP_USER_DASHBOARD_WITHDRAWAL_REGULAR_BANK_TRANSFER_VISIBLE !== 'false';
const kycCheckNotificationEnabled = import.meta.env.VUE_APP_USER_DASHBOARD_KYC_CHECK_NOTIFICATION_ENABLED !== 'false';
const headerBackLinkVisible = import.meta.env.VUE_APP_HEADER_BACK_LINK_VISIBLE === 'true';
const footerLinksVisible = import.meta.env.VUE_APP_FOOTER_LINKS_VISIBLE === 'true';
const footerCopyrightsVisible = import.meta.env.VUE_APP_FOOTER_COPYRIGHTS_VISIBLE === 'true';
const manualGuideLinkVisible = import.meta.env.VUE_APP_MANUAL_GUIDE_LINK_VISIBLE === 'true';
const apiListPageVisible = import.meta.env.VUE_APP_API_LIST_PAGE_VISIBLE === 'true';
const swaggerUrl = import.meta.env.VUE_APP_SWAGGER_URL;
const brandLogoLUrl = import.meta.env.VUE_APP_BRAND_LOGO_L_URL;
const brandLogoMUrl = import.meta.env.VUE_APP_BRAND_LOGO_M_URL;
const appPrimaryColor = import.meta.env.VUE_APP_PRIMARY_COLOR;
const appPrimaryHoverColor = import.meta.env.VUE_APP_PRIMARY_HOVER;
const backOfficeRoutesVisible = import.meta.env.VUE_APP_BACK_OFFICE_ROUTES !== 'false';
const frontOfficeRoutesVisible = import.meta.env.VUE_APP_FRONT_OFFICE_ROUTES !== 'false';
const availableRole = import.meta.env.VUE_APP_AVAILABLE_ROLE;

const backOfficeClientsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CLIENTS_PAGE_VISIBLE === 'true';
const backOfficeClientsKycPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CLIENTS_KYC_PAGE_VISIBLE === 'true';
const backOfficeClientsPagesVisible = backOfficeClientsPageVisible || backOfficeClientsKycPageVisible;

const backOfficeRolesTeamMembersPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_ROLES_TEAM_MEMBERS_PAGE_VISIBLE === 'true';
const backOfficeRolesTrustedDomainsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_ROLES_TRUSTED_DOMAINS_PAGE_VISIBLE === 'true';
const backOfficeRolesRolesAndPermissionsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_ROLES_ROLES_AND_PERMISSIONS_PAGE_VISIBLE === 'true';
const backOfficeRolesPagesVisible =
  backOfficeRolesTeamMembersPageVisible || backOfficeRolesTrustedDomainsPageVisible || backOfficeRolesRolesAndPermissionsPageVisible;

const backOfficeCfoAssetsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_ASSETS_PAGE_VISIBLE === 'true';
const backOfficeCfoAssetRatesPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_ASSET_RATES_PAGE_VISIBLE === 'true';
const backOfficeCfoSystemAccountsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_SYSTEM_ACCOUNTS_PAGE_VISIBLE === 'true';
const backOfficeCfoCashierPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_CASHIER_PAGE_VISIBLE === 'true';
const backOfficeCfoCashDeskPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_CASH_DESK_PAGE_VISIBLE === 'true';
const backOfficeCfoReconciliationPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_RECONCILIATION_PAGE_VISIBLE === 'true';
const backOfficeCfoOperationalDaysPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_OPERATIONAL_DAYS_PAGE_VISIBLE === 'true';
const backOfficeCfoSystemCalendarPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CFO_SYSTEM_CALENDAR_PAGE_VISIBLE === 'true';
const backOfficeCfoPagesVisible =
  backOfficeCfoAssetsPageVisible ||
  backOfficeCfoAssetRatesPageVisible ||
  backOfficeCfoSystemAccountsPageVisible ||
  backOfficeCfoCashierPageVisible ||
  backOfficeCfoCashDeskPageVisible ||
  backOfficeCfoReconciliationPageVisible ||
  backOfficeCfoOperationalDaysPageVisible ||
  backOfficeCfoSystemCalendarPageVisible;

const backOfficeCroVendorsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CRO_VENDORS_PAGE_VISIBLE === 'true';
const backOfficeCroContractsPageVisible = import.meta.env.VUE_APP_BACK_OFFICE_CRO_CONTRACTS_PAGE_VISIBLE === 'true';
const backOfficeCroPagesVisible = backOfficeCroVendorsPageVisible || backOfficeCroContractsPageVisible;

const backOfficeInvestigationsPagesVisible = import.meta.env.VUE_APP_BACK_OFFICE_INVESTIGATIONS_PAGE_VISIBLE === 'true';

const userDashboardWithdrawalDebitCardAddCardActionVisible =
  import.meta.env.VUE_APP_USER_DASHBOARD_WITHDRAWAL_DEBIT_CARD_ADD_CARD_ACTION_VISIBLE !== 'false';

export const ENV_VARIABLES = {
  createWalletCustomSerialInputVisible,
  makePaymentTransferToAccountActionVisible,
  makePaymentTransferToCardActionVisible,
  makePaymentMobileTopUpActionVisible,
  makePaymentOtherPaymentsActionVisible,
  userDashboardExchangeVisible,
  userDashboardCurrencyRatesVisible,
  makePaymentOperationsVisible,
  businessOperationKycRestrictionsEnabled,
  topUpRegularBankTransferVisible,
  topUpAlwaysEnableCardTokenization,
  withdrawalRegularBankTransferVisible,
  kycCheckNotificationEnabled,
  headerBackLinkVisible,
  footerLinksVisible,
  footerCopyrightsVisible,
  manualGuideLinkVisible,
  apiListPageVisible,
  brandLogoLUrl,
  brandLogoMUrl,
  appPrimaryColor,
  appPrimaryHoverColor,
  backOfficeRoutesVisible,
  frontOfficeRoutesVisible,
  availableRole,
  backOfficeClientsPageVisible,
  backOfficeClientsKycPageVisible,
  backOfficeClientsPagesVisible,
  swaggerUrl,

  backOfficeRolesTeamMembersPageVisible,
  backOfficeRolesTrustedDomainsPageVisible,
  backOfficeRolesRolesAndPermissionsPageVisible,
  backOfficeRolesPagesVisible,

  backOfficeInvestigationsPagesVisible,
  backOfficeCfoAssetsPageVisible,
  backOfficeCfoAssetRatesPageVisible,
  backOfficeCfoSystemAccountsPageVisible,
  backOfficeCfoCashierPageVisible,
  backOfficeCfoCashDeskPageVisible,
  backOfficeCfoReconciliationPageVisible,
  backOfficeCfoOperationalDaysPageVisible,
  backOfficeCfoSystemCalendarPageVisible,
  backOfficeCfoPagesVisible,

  backOfficeCroVendorsPageVisible,
  backOfficeCroContractsPageVisible,
  backOfficeCroPagesVisible,

  userDashboardWithdrawalDebitCardAddCardActionVisible,
};
