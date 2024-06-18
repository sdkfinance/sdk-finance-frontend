export function loadExternalScript(
  src: string,
  options: {
    fromSrc: true;
    async?: boolean;
  },
): void;
export function loadExternalScript(
  content: string,
  options?: {
    fromSrc?: boolean;
    async?: boolean;
  },
): void;
export function loadExternalScript(
  contentOrSrc: string,
  options: {
    fromSrc?: boolean;
    async?: boolean;
  } = {},
): void {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';

  if (options?.fromSrc) {
    scriptElement.src = contentOrSrc;
  } else {
    scriptElement.innerHTML = contentOrSrc;
  }

  scriptElement.async = options?.async ?? false;

  const docHead = document.getElementsByTagName('head')[0];

  if (!docHead) {
    throw new Error('Something went wrong');
  }

  docHead.appendChild(scriptElement);
}
