import type { IApiResponse, IPaginationRequestOptions, IPaginationResponse } from '../../types';

export interface ILocalizationFilter {
  ids?: number[];
  key?: string;
  value?: string;
}

export interface ILocalizationSort {
  key?: string;
}

export interface ILocalization {
  id: number;
  key: string;
  [key: string]: string | number;
}

export interface ILocalizationValue {
  locale: string;
  value: string | number;
}

export interface ILocalizationRecord {
  id: number;
  key: string;
  values: ILocalizationValue[];
}

export interface ILocalizationCreateBody {
  key: string;
  values: ILocalizationValue[];
}

export interface ILocalizationUpdateBody {
  values: ILocalizationValue[];
}

type ILocalizationResponse = IPaginationResponse<ILocalizationRecord>;

export type ILocalizationOptions = IPaginationRequestOptions<ILocalizationFilter, ILocalizationSort>;

export type IGetLocalizationsApiResponse = IApiResponse<ILocalizationResponse>;
