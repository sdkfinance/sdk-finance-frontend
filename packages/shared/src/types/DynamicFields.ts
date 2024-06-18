export interface IDynamicFieldConstraint {
  errorMessageKey: string;
  regex: string;
  type: string;
}

export interface IDynamicField {
  constraints: IDynamicFieldConstraint[];
  label: string;
  name: string;
  onlineCheck: boolean;
  optional: boolean;
}
