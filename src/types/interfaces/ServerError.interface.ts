export type TServerError = { parameter: string; message: string };

export interface IServerError {
  message: string;
  code: string;
  unknownProperty?: string;
  errors: TServerError[];
}
