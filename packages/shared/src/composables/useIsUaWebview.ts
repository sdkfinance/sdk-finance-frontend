export const useIsUaWebview = () => {
  const { userAgent } = window.navigator;
  const normalizedUserAgent = userAgent.toLowerCase();
  const { standalone } = window.navigator as any;
  const isIos = /ip(ad|hone|od)/.test(normalizedUserAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(normalizedUserAgent);
  const isSafari = /safari/.test(normalizedUserAgent);
  const isWebview = (isAndroid && /; wv\)/.test(normalizedUserAgent)) || (isIos && !standalone && !isSafari);

  return {
    isIos,
    isAndroid,
    isSafari,
    isWebview,
  };
};
