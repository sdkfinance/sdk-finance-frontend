import type { IRouteConfig } from '@sdk5/shared/types';

const InvoicePaymentLinkPage = () => import('./pages/invoice-payment-link-page.vue');

export const INVOICE_PAYMENT_LINK: IRouteConfig = {
  path: '/invoice/:identifier',
  name: 'invoicePaymentLink',
  component: InvoicePaymentLinkPage,
  meta: {
    disableGuard: true,
  },
};
