import type { AxiosResponse } from 'axios';

import type { IServerError } from './ServerError.interface';

type TErrorResponse = {
  response: null;
  error: IServerError;
  originalResponse?: AxiosResponse;
};

type TSuccessResponse<R> = {
  response: R;
  error: null;
  originalResponse?: AxiosResponse;
};

export type IApiResponse<R> = TSuccessResponse<R> | TErrorResponse;
