import { POSITION, type ToastOptions } from '@sdk5/vue-toast';
import Vue from 'vue';
import type { LocaleMessage } from 'vue-i18n';

import { i18n } from '../i18n';
import type { IServerError } from '../types';

type IPlainObject = Record<string, any>;
const notificationConfig: Omit<ToastOptions, 'type'> = {
  position: POSITION.TOP_RIGHT,
  closeOnClick: false,
};

const isServerError = (error: unknown): error is IServerError => {
  const serverError = error as IServerError;
  return !!(serverError?.code ?? serverError?.mdcId ?? serverError?.parameters);
};

const getServerErrorMessage = (serverError: IServerError) => {
  const translateValues = serverError?.parameters?.reduce(
    (acc, current) => {
      const { key, value } = current;
      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
  return i18n.t(`__server_errors.${serverError.code}`, translateValues);
};

export function successNotification(message = 'notification.success') {
  Vue.$toast.success(i18n.t(message), {
    ...notificationConfig,
  });
}

function isHtmlErrorResponse(error: unknown): boolean {
  const htmlCheckRegEx = /<\/?[html\s="/.':;#-/?]+>/gi;

  if (typeof error !== 'string') {
    return false;
  }

  return htmlCheckRegEx.test(error);
}

export function errorNotification(error: IServerError | string, localeParams: IPlainObject = {}): void {
  let message: LocaleMessage = '';

  if (isServerError(error)) {
    message = getServerErrorMessage(error);
  } else if (isHtmlErrorResponse(error)) {
    message = i18n.t('entity.error.UNKNOWN');
  } else {
    message = i18n.t(error, localeParams);
  }

  Vue.$toast.error(message, {
    ...notificationConfig,
  });
}
