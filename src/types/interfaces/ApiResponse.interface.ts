import { AxiosResponse } from 'axios';

import { IServerError } from '@/types/interfaces/ServerError.interface';

type TErrorResponse = {
  response: null;
  error: IServerError;
  originalResponse?: AxiosResponse;
}

type TSuccessResponse<R>= {
  response: R;
  error: null;
  originalResponse?: AxiosResponse;
}

export type IApiResponse<R> = TSuccessResponse<R> | TErrorResponse;
