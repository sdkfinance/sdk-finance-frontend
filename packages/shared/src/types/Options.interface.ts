export interface IOption {
  label: string | number;
  value: string | number;
  command?: string | { action: any };
  classes?: string;
  icon?: string;
}

export interface IOptionStrings extends IOption {
  label: string;
  value: string;
}
