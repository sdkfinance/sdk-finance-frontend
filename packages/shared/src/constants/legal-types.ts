export interface IType {
  [key: string]: string;
}

export const LEGAL_TYPES: IType = {
  individual: 'individual',
  corporation: 'corporation',
};

export const LEGAL_TYPES_ARRAY = Object.keys(LEGAL_TYPES).map((key) => ({ value: key, label: `entity.legal.${LEGAL_TYPES[key]}` }));
