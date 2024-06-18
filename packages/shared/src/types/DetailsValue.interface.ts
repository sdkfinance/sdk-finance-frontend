export interface IDetailsValue<V = any> {
  label: string;
  value: V;
  param: string;
  hide?: boolean;
}
