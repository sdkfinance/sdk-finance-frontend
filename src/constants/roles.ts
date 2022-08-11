export type TRole = 'administrator' | 'cfo' | 'individual' | 'merchant' | 'compliance_manager'
    | 'compliance_specialist' | 'customer_support'
    | 'antifraud_specialist' | 'accountant' | 'cashier';

export type TRoleSimple = 'individual' | 'merchant' | 'cashier';

export const ROLES: { [key: string]: TRole } = {
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

export const SIMPLE_ROLES: { [key: string]: TRoleSimple } = {
  individual: 'individual',
  merchant: 'merchant',
  cashier: 'cashier',
};

export const ROLES_ARRAY = Object.keys(ROLES).map((key) => ({ value: key, label: `entity.role.${ROLES[key]}` }));
export const SIMPLE_ROLES_ARRAY = Object.keys(SIMPLE_ROLES).map((key) => ({ value: key, label: `entity.role.${SIMPLE_ROLES[key]}` }));
