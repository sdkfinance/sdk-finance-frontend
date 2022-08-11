import { AxiosResponse } from 'axios';
import { IServerError } from '@/types/interfaces/ServerError.interface';

export interface IApiResponse<R> {
  response: R | null;
  error: IServerError | null;
  originalResponse?: AxiosResponse;
}
