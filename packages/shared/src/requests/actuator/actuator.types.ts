/* eslint-disable @typescript-eslint/naming-convention */

import type { TRole } from '@sdk5/shared/constants';

export type TApiItemRecordItem = {
  HTTP_method: string;
  path: string;
  permissions: string[];
  request_parameters: string[];
  roles: TRole[];
  tags: string[];
};

export type TApiRecordItem = {
  name: string;
  tag?: string;
  number_of_APIs: number;
  description?: string;
  records: TApiItemRecordItem[];
};

export type TFetchApiListResponse = {
  records: TApiRecordItem[];
  totalNumberOfAPIs: number;
};
