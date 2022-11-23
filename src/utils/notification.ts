import { Notification } from 'element-ui';
// eslint-disable-next-line import/no-unresolved
import { ElNotificationOptions } from 'element-ui/types/notification';
import { LocaleMessage } from 'vue-i18n';

import { i18n } from '@/i18n';
import { IPlainObject, IServerError } from '@/types/interfaces';

const notificationConfig = {
  position: 'top-right',
  customClass: 'v-notification',
  showClose: true,
};

export function successNotification(message = 'notification.success') {
  Notification.success({
    ...notificationConfig,
    title: i18n.t('notification.success_title'),
    iconClass: 'v-notification__icon v-notification__icon--success',
    message: i18n.t(message),
  } as ElNotificationOptions);
}

function isHtmlErrorResponse(error: unknown): boolean {
  const htmlCheckRegEx = /<\/?[html\s="/.':;#-/?]+>/gi;

  if (typeof error !== 'string') return false;

  return htmlCheckRegEx.test(error);
}

export function errorNotification(error: IServerError | string, localeParams: IPlainObject = {}): void {
  let message: LocaleMessage = '';

  if (isHtmlErrorResponse(error)) {
    message = i18n.t('entity.error.UNKNOWN');
  } else if (typeof error !== 'string') {
    message = i18n.t(`__server_errors.${error.code}`);
  } else {
    message = i18n.t(error, localeParams);
  }

  Notification.error({
    ...notificationConfig,
    title: i18n.t('notification.error_title'),
    iconClass: 'v-notification__icon v-notification__icon--error',
    message,
  } as ElNotificationOptions);
}
