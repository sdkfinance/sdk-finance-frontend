import { loadExternalScript } from './loadExternalScript';

export const initGoogleTag = (tagId: string) => {
  if (!tagId) {
    throw new Error('TagId is required for Google Tag initialization');
  }

  loadExternalScript(`https://www.googletagmanager.com/gtag/js?id=${tagId}`, { async: true, fromSrc: true });
  loadExternalScript(
    `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', '${tagId}');
  `,
  );
};
