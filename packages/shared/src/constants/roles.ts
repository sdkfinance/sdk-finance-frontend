export type TFrontOfficeRole = 'individual' | 'merchant';
export type TRole =
  | TFrontOfficeRole
  | (
      | 'administrator'
      | 'cfo'
      | 'compliance_manager'
      | 'compliance_specialist'
      | 'customer_support'
      | 'antifraud_specialist'
      | 'accountant'
      | 'cashier'
    );

export type TRoleSimple = TFrontOfficeRole | 'cashier';

export const ROLES: {
  [K in TRole]: K;
} = {
  administrator: 'administrator',
  cfo: 'cfo',
  individual: 'individual',
  merchant: 'merchant',
  compliance_manager: 'compliance_manager',
  compliance_specialist: 'compliance_specialist',
  customer_support: 'customer_support',
  antifraud_specialist: 'antifraud_specialist',
  accountant: 'accountant',
  cashier: 'cashier',
};

export const SIMPLE_ROLES: Record<TRoleSimple, TRoleSimple> = {
  individual: 'individual',
  merchant: 'merchant',
  cashier: 'cashier',
};

export const ROLES_KEYS = Object.keys(ROLES) as Array<keyof typeof ROLES>;
export const SIMPLE_ROLES_KEYS = Object.keys(SIMPLE_ROLES) as Array<keyof typeof SIMPLE_ROLES>;

export const ROLES_ARRAY = ROLES_KEYS.map((key) => ({ value: key, label: `entity.role.${ROLES[key]}` }));
export const SIMPLE_ROLES_ARRAY = SIMPLE_ROLES_KEYS.map((key) => ({ value: key, label: `entity.role.${SIMPLE_ROLES[key]}` }));
