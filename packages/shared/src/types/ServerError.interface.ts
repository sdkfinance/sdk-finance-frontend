export type TServerError = { parameter: string; message: string };
export type TServerErrorParam = {
  key: string;
  value: string;
};
export interface IServerError {
  code: string;
  unknownProperty?: string;
  errors: TServerError[];
  parameters?: TServerErrorParam[];
  mdcId: string;
}
