const mobileView = '(max-width: 599px)';

export const checkMobile = (): boolean => window.matchMedia(mobileView).matches;
